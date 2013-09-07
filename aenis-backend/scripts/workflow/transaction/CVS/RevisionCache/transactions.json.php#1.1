<?php
user_auth_check();

$start = $_POST['start'];
$limit = $_POST['limit'];
$init = $_POST['init'];

//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'search_transactions_'.$_POST['view_uid'];

if(1 == $_POST['init']) //if init=1 found in request, reset session
{
	//unset search parameters
	$oSession->unsetCollection($session_collection_key);

	//set search parameters into session
	if(!empty($_POST['params']))
	{
		$params = App_Json::decode($_POST['params'], true);
		$oSession->setItem('params', new App_Session_Item_Object($params), $session_collection_key);
	}
}

//get search parameters from session
$search = $oSession->getItem('params', $session_collection_key);

$items = array();
$oTransactions = new Transactions();
$result = $oTransactions->getTransactions($search, $start, $limit);
while($row = $oTransactions->db_fetch_array($result))
{
	$customer_name = array();
	if(!empty($row['last_name']))
		$customer_name[] = $row['last_name'];
	if(!empty($row['name']))
		$customer_name[] = $row['name'];
	if(!empty($row['middle_name']))
		$customer_name[] = $row['middle_name'];
	$customer_name = implode(' ', $customer_name);
	$items[] = array(
		'id' => $row['id'],
		'customer' => $customer_name,
		'notary_id' => $row['notary_id'],
		'notary' => $row['notary'],
		'lu_user_name' => $row['lu_user_name'],
		'tr_status_code' => $row['tr_status_code'],
		'tr_status_title' => $row['tr_status_title'],
		'tr_type_label' => $row['tr_type_label'],
		'tr_creation_date' => $row['lu_date'],
		'app_id' => $row['app_id']
	);
}

if($init == 1)
{
	$total = $oTransactions->getTransactions($search, 0, 0, true);
	$oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
}
else
{
	$total = $oSession->getItem('total', $session_collection_key);
}

Ext::sendResponse(true, array(
	'data' => $items,
	'total' => $total
));
