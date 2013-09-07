<?php
user_auth_check();

$cache_id = 'house_types';
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new House_Types();
	$result = $o->getTypes();
	while($row = $o->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'label' => $row['label']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(House_Types::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
