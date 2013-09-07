<?php
user_auth_check();

$search = array();
$filters = App_Json::decode($_GET['filter'], true);
foreach($filters as $filter)
{
	$search[$filter['property']] = $filter['value'];
}

$items = array();
$oRelationships = new Transaction_Relationships();
$result = $oRelationships->getRelationships($search);
while($row = $oRelationships->db_fetch_array($result))
{
	$items[] = App_Array::pick($row,
		'id',
		'tr_id'
	);
}

Ext::sendResponse(true, array(
	'data' => $items
));
