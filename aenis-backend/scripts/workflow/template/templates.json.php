<?php
user_auth_check();

$search = array();
$filter = App_Json::decode($_REQUEST['filter']);
if(!empty($filter) && $filter[0]->property == 'doc_type_id')
{
	$search['doc_type_id'] = $filter[0]->value;
}
else
{
	if(isset($_REQUEST['doc_type_id']))
	{
		$search['doc_type_id'] = $_REQUEST['doc_type_id'];
	}
	else
	{
		if(!empty($_REQUEST['doc_type_code']))
			$search['doc_type_code'] = $_REQUEST['doc_type_code'];
	}
}

if(!empty($_REQUEST['id']))
	$search['template_id'] = $_REQUEST['id'];

if(!empty($_REQUEST['tr_type_id']))
	$search['tr_type_id'] = $_REQUEST['tr_type_id'];

$search['detailed'] = (1 == $_REQUEST['detailed']);

$cache_id = 'templates_'.md5(serialize(array($search, App_Registry::get('temp_sn')->user_id)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Templates();
	$result = $o->getItems($search);
	while($row = $o->db_fetch_array($result))
	{
		$item = array(
			'id' => $row['id'],
			'doc_type_id' => $row['doc_type_id'],
			'is_common_template' => empty($row['definer_user_id']),
			'definer_user_id' => $row['definer_user_id'],
			'definer_user_full_name' => $row['definer_user_full_name'],
			'title' => $row['title']
		);
		if($search['detailed'])
		{
			$item += array(
				'content' => $row['content']
			);
		}
		$items[] = $item;
	}
	App_Cache()->set($cache_id, $items, null, array(Templates::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
