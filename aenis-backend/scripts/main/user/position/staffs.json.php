<?php
user_auth_check();

$filter = App_Json::decode($_REQUEST['filter']);
if(!empty($filter) && $filter[0]->property == 'user_id')
{
	$user_id = $filter[0]->value;
}

$cache_id = 'user_staffs_'.md5(serialize(array($user_id)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$oUserPositions = new User_Positions();
	$result = $oUserPositions->getUserPositions($user_id);
	while($row = $oUserPositions->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'user_id' => $row['user_id'],
			'staff_id' => $row['staff_id'],
			'staff_title' => $row['staff_title'],
			'dep_title' => $row['dep_title'],
			'hire_date' => $row['hire_date'],
			'leaving_date' => $row['leaving_date'],
			'is_active' => empty($row['is_active']) ? false : true
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Users::CACHE_TAG, Staff::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
