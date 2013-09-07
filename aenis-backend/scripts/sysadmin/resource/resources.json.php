<?php
user_auth_check();

$types = $_GET['types'];
if(empty($types))
	$types = array();
else
	$types = explode(',', $types);

$items = array();

$o = new Resources();
$result = $o->getResources(array('types'=>$types));
while($row = $o->db_fetch_array($result))
{
	$items[] = array(
		'id' => $row['id'],
		'title' => $row['title'],
		'code' => $row['code'],
		'type' => $row['type'],
		'is_root_resource' => $row['is_root_resource']
	);
}

Ext::sendResponse(true, array(
	'data' => $items
));
