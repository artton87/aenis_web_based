<?php
user_auth_check();

$detailed = (1 == $_REQUEST['detailed']);
$root_member_id = 0;

$cache_id = 'departments_'.md5(serialize(array($root_member_id, $detailed)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$o = new Departments();

	$stack = array(array());
	$stack_top = 0;

	$result = $o->getDepartments($root_member_id, $detailed);
	while($row = $o->db_fetch_array($result))
	{
		if($row['xml_tag']==='0')    //0 means closing tag
		{
			--$stack_top;
			$stack[$stack_top][count($stack[$stack_top])-1]['data'] = array_pop($stack);
		}
		else
		{
			$item = array(
				'id' => $row['id'],
				'parent_id' => $row['parent_id'],
				'title' => $row['title'],
				'code' => $row['code'],
				'fax' => $row['fax'],
				'phone' => $row['phone'],
				'email' => $row['email'],
				'type_id' => $row['dep_type_id'],
				'notarial_office_id' => $row['notarial_office_id']
			);
			if($detailed)
			{
				$item = array_merge($item, array(
					'num' => $row['num'],
					'parent_title' => $row['parent_title'],
					'notarial_office_title' => $row['notarial_office_title']
				));
			}

			if($row['xml_tag']==='1')    // right-left=1 means that node doesn't have departments, so use shorthand xml syntax
			{
				$item['leaf'] = true;
			}

			$stack[$stack_top][] = $item;

			if($row['xml_tag']!=='1')
			{
				array_push($stack, array());
				++$stack_top;
			}

		}
	}
	$items = $stack[$stack_top];
	App_Cache()->set($cache_id, $items, null, array(Departments::CACHE_TAG, NotarialOffices::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
