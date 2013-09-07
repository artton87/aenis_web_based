<?php
user_auth_check();

$items = array();

$o = new Modules();
$result = $o->getModules(0, null);
while($row = $o->db_fetch_array($result))
{
	$items[] = array(
		'id' => $row['id'],
		'title' => htmlspecialchars($row['title']),
		'description' => htmlspecialchars($row['description']),
		'module' => htmlspecialchars($row['module']),
		'is_enabled' => htmlspecialchars($row['is_enabled']),
		'app_order' => htmlspecialchars($row['app_order']),
		'resource_id' => htmlspecialchars($row['resource_id'])
	);
}
Ext::sendResponse(true, array('data' => $items));
