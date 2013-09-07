<?php
user_auth_check();

$cache_id = 'department_types';
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Department_Types();
	$result = $o->getTypes();
	while($row = $o->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'title' => $row['title']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Department_Types::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
