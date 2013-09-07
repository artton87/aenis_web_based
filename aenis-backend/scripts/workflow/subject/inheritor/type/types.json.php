<?php
user_auth_check();

$cache_id = 'subject_inheritor_types';
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Subject_Inheritor_Types();
	$result = $o->getTypes();
	while($row = $o->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'label' => $row['label']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Subject_Inheritor_Types::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
