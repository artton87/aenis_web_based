<?php
user_auth_check();
Logger::out($_POST);
$search = array();
$filters = App_Json::decode($_GET['filter'], true);
foreach($filters as $filter)
{
	$search[$filter['property']] = $filter['value'];
}

$items = array();
$oParties = new Transaction_Relationship_Parties();
$result = $oParties->getParties($search);
while($row = $oParties->db_fetch_array($result))
{
	$items[] = App_Array::pick($row,
		'id',
		'rel_id',
		'party_type_id',
		'party_type_code',
		'party_type_label'
	);
}

Ext::sendResponse(true, array(
	'data' => $items
));
