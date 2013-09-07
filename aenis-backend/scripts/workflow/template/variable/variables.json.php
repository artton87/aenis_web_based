<?php
user_auth_check();

$detailed = (1==$_REQUEST['detailed']) ? true : false;

$search = array();
if(isset($_REQUEST['doc_type_id']))
{
	$search['doc_type_id'] = $_REQUEST['doc_type_id'];
}
else
{
	if(!empty($_REQUEST['doc_type_code']))
		$search['doc_type_code'] = $_REQUEST['doc_type_code'];
}

if(!empty($_REQUEST['tr_type_id']))
	$search['tr_type_id'] = $_REQUEST['tr_type_id'];

$cache_id = 'template_variables_'.md5(serialize(array($detailed, $search)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Template_Variables();
	$result = $o->getItems($search);
	while($row = $o->db_fetch_array($result))
	{
		$row['has_parameters'] = false;
		if($row['is_dynamic'])
		{
			$oVar = Template_Variables::factory($row['code']);
			$parameters = $oVar->getParameters();
			$row['has_parameters'] = !empty($parameters);
		}

		$item = array(
			'id' => $row['id'],
			'title' => $row['title'],
			'code' => $row['code'],
			'content' => $row['content'],
			'is_dynamic' => $row['is_dynamic'],
			'has_parameters' => $row['has_parameters']
		);
		if($detailed)
		{
			$item += array(
				'doc_type_id' => $row['doc_type_id'],
				'doc_type_label' => $row['doc_type_label']
			);
		}
		$items[] = $item;
	}
	App_Cache()->set($cache_id, $items, null, array(Template_Variables::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
