<?php
user_auth_check();

$filter = App_Json::decode($_REQUEST['filter']);
if(!empty($filter) && $filter[0]->property == 'staff_id')
{
	$staff_id = $filter[0]->value;
}

$cache_id = 'staff_users_'.md5(serialize(array($staff_id)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$oUserPositions = new User_Positions();
	$result = $oUserPositions->getPositionUsers($staff_id);
	while($row = $oUserPositions->db_fetch_array($result))
	{
		$user_full_name = array();
		if(!empty($row['last_name']))
			$user_full_name[] = $row['last_name'];
		if(!empty($row['first_name']))
			$user_full_name[] = $row['first_name'];
		if(!empty($row['second_name']))
			$user_full_name[] = $row['second_name'];

		$items[] = array(
			'id' => $row['id'],
			'user_id' => $row['user_id'],
			'staff_id' => $row['staff_id'],
			'user_full_name' => implode(' ',$user_full_name),
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
