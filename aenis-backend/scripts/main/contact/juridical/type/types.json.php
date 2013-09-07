<?php
user_auth_check();

$cache_id = 'contact_jp_types';
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Contact_Juridical_Types();
	$result = $o->getTypes();
	while($row = $o->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'name' => $row['name'],
			'abbreviation' => $row['abbreviation']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Contact_Juridical_Types::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
