<?php
user_auth_check();

$include_root_types = true;
if(1 == $_REQUEST['no_root_types'])
	$include_root_types = false;

$cache_id = 'transaction_property_types_'.md5(serialize(array(array(), $include_root_types)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$o = new Transaction_Property_Types();
	$result = $o->getTypes(array(), $include_root_types);
	while($row = $o->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'label' => $row['label'],
			'code' => $row['code'],
			'type' => $row['type']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Transaction_Property_Types::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));