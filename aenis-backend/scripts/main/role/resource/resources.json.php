<?php
user_auth_check();

$items = array();

$filter = App_Json::decode($_REQUEST['filter']);
if(!empty($filter) && $filter[0]->property == 'role_id')
{
	$role_id = $filter[0]->value;
}
else
{
	$role_id = 0;
}

$user_is_root = App_Registry::get('temp_sn')->user_is_root;

$oRoleResources = new Role_Resources();
$result = $oRoleResources->getResources($role_id, $user_is_root);
while($row = $oRoleResources->db_fetch_array($result))
{
	$items[] = array(
		'role_id' => $role_id,
		'resource_id' => $row['resource_id'],
		'title' => $row['title'],
		'code' => $row['code'],
		'type' => $row['type'],
		'allowed' => empty($row['role_allowed_res_id']) ? false : true
	);
}

Ext::sendResponse(true, array(
	'data' => $items
));
