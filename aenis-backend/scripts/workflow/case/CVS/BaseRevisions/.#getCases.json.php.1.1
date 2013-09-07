<?php

user_auth_check();

//echo "<pre>"; print_r($_POST); echo "</pre>"; exit;

$start = $_POST['start'];
$limit = $_POST['limit'];
$init = $_POST['init'];

//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'cases_'.$_POST['view_uid'];

if(1 == $init ) //if init=1 found in request, reset session
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


$user_id = App_Registry::get('temp_sn')->user_id;
//$search['user_id'] = $user_id;
//in manage.js 1=not scanned, 2=scanned, but in db 0=not scanned, 1=scanned
if ($_POST['is_all_scanned'])
	$search['is_all_scanned'] = intval($_POST['is_all_scanned']) - 1;
if ($_POST['case_code'])
	$search['case_code'] = $_POST['case_code'];
if ($_POST['notary_user_id'])
	$search['notary_user_id'] = $_POST['notary_user_id'];

$oCases = new Cases();
$results = $oCases->getCases($search, $start, $limit);
//var_dump($results); exit;
$items = array();
while($row = $oCases->db_fetch_array($results)){
	$items[] = array(
		'id' => $row['id'],
		'case_code' => $row['case_code'],
		'is_all_scanned' => $row['is_all_scanned'] ? true : false
	);
}

if($init == 1)
{
	$total = $oCases->getCases($search, 0, 0, true);
	$oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
}
else
{
	$total = $oSession->getItem('total', $session_collection_key);
}
$output = array(
	'data' => $items,
	'total' => $total
);
$totalCountResult = $oCases->getCases(array('user_id' => $user_id), 0, 0, true);
if($row = $oCases->db_fetch_array($totalCountResult))
{
	$total = $row['count'];
}

App_Registry::get('temp_sn')->total = $total;

if($init == 1)
{
	$output = array(
		'data' => $items,
		'total' => $total
	);
}
else
{
	$output = array(
		'data' => $items,
		'total' => App_Registry::get('temp_sn')->total
	);
}

$success = true;

Ext::sendResponse($success, $output);
