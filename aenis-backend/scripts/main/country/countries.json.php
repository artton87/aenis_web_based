<?php
user_auth_check();

$bOnlyPrimaryCountries = (1 == $_REQUEST['onlyPrimaryCountries']);
$bOnlyForeignCountries = (1 == $_REQUEST['onlyForeignCountries']);

$cache_id = 'countries_'.md5(serialize(array($bOnlyPrimaryCountries, $bOnlyForeignCountries)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Countries();
	$result = $o->getCountries($bOnlyPrimaryCountries, $bOnlyForeignCountries);
	while($row = $o->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'name' => $row['name'],
			'code' => $row['code']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Countries::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
