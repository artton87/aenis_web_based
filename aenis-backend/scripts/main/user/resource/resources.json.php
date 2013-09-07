<?php
user_auth_check();

$items = array();

$filter = App_Json::decode($_REQUEST['filter']);
if(!empty($filter) && $filter[0]->property == 'user_id')
{
	$user_id = $filter[0]->value;
}

$user_is_root = App_Registry::get('temp_sn')->user_is_root;

$oUserResources = new User_Resources();
$result = $oUserResources->getResources($user_id, $user_is_root);
while($row = $oUserResources->db_fetch_array($result))
{
	$items[] = array(
		'user_id' => $user_id,
		'resource_id' => $row['resource_id'],
		'title' => $row['title'],
		'code' => $row['code'],
		'allowed' => empty($row['user_allowed_res_id']) ? false : true
	);
}

Ext::sendResponse(true, array(
	'data' => $items
));
