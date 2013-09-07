<?php
user_auth_check();

$cache_id = 'roles';
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();

	$oRoles = new Roles();
	$result = $oRoles->getRoles();
	while($row = $oRoles->db_fetch_array($result))
	{
		$items[] = array(
			'id' => $row['id'],
			'title' => $row['title']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Roles::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
