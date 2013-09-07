<?php
user_auth_check();

$start = $_POST['start'];
$limit = $_POST['limit'];
$init = $_POST['init'];

//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'search_warrants_'.$_POST['view_uid'];

if(1 == $_POST['init']) //if init=1 found in request, reset session
{
	//unset search parameters
	$oSession->unsetCollection($session_collection_key);

	//set search parameters into session
    if(!empty($_POST['params']))
    {
        $params = App_Json::decode($_POST['params'], true);
    }

    if(!empty($_POST['lu_date']))
    {
        $params = array(
            'lu_date' => date('Y-m-d',strtotime($_POST['lu_date']))
        );
    }

    $oSession->setItem('params', new App_Session_Item_Object($params), $session_collection_key);
}

//get search parameters from session
$search = $oSession->getItem('params', $session_collection_key);

$items = array();
$oWarrants = new Warrants();
$result = $oWarrants->getWarrants($search, $start, $limit);
while($row = $oWarrants->db_fetch_array($result))
{
	$customer_name = array();
	if(!empty($row['last_name']))
		$customer_name[] = $row['last_name'];
	if(!empty($row['name']))
		$customer_name[] = $row['name'];
	if(!empty($row['middle_name']))
		$customer_name[] = $row['middle_name'];
	$customer_name = implode(' ', $customer_name);

    $resultRate = $oWarrants->getRates(array('tr_type_id'=>$row['tr_type_id']));
    $rates = array();
    while($rowRate = $oWarrants->db_fetch_array($resultRate))
    {
        $rates[] = array(
          'tr_type_id' => empty($rowRate['tr_type_id'])? 0 :$rowRate['tr_type_id'],
          'parcel_purpose_type_id' => empty($rowRate['parcel_purpose_type_id']) ? 0 :$rowRate['parcel_purpose_type_id'],
          'inheritor_type_id' => empty($rowRate['inheritor_type_id']) ? 0 :$rowRate['inheritor_type_id'],
          'building_type_id' => empty($rowRate['building_type_id']) ? 0 : $rowRate['building_type_id'],
          'state_fee_coefficient' => empty($rowRate['state_fee_coefficient']) ? 0 : $rowRate['state_fee_coefficient'],
        );
    }

    $resultPayment = $oWarrants->getTransactionPayment(array('tr_id'=>$row['id']));
    $payments = array();
    while($rowPayment = $oWarrants->db_fetch_array($resultPayment))
    {
        //Logger::out($rowPayment);
        $payments[] = array(
            'is_paid' => $rowPayment['is_paid']
        );
    }
    //$payments = array_unique($payments);

	$items[] = array(
		'id' => $row['id'],
		'customer' => $customer_name,
		'notary_id' => $row['notary_id'],
		'notary' => $row['notary'],
		'locked_user_id' => $row['locked_user_id'],
		'locked_user' => $row['locked_user'],
		'tr_status_code' => $row['tr_status_code'],
		'tr_status_title' => $row['tr_status_title'],
		'tr_type_id' => $row['tr_type_id'],
		'tr_type_label' => $row['tr_type_label'],
		'lu_user' => $row['lu_user'],
		'lu_date' => $row['lu_date'],
		'app_id' => $row['app_id'],
        'is_paid' =>  (1 == $payments[0]['is_paid']) ? true : false,
        'transaction_code' => $row['transaction_code'],
        'service_fee_coefficient_min' => $row['service_fee_coefficient_min'],
        'service_fee_coefficient_max' => $row['service_fee_coefficient_max'],
        'case_code' => $row['case_code'],
        'rateData' => $rates
	);
}

if($init == 1)
{
	$total = $oWarrants->getWarrants($search, 0, 0, true);
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
