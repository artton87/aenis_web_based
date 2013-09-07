<?php
user_auth_check();

$init = $_POST['init'];
$start = $_POST['start'];
$limit = $_POST['limit'];

$oInheritance = null;

//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'search_inheritance';

if(1 == $_POST['init']) //if init=1 found in request, reset session
{

	//unset search parameters
	$oSession->unsetCollection($session_collection_key);

	//set search parameters into session
	$params = App_Json::decode($_POST['params'], true);
	/*$params['tr_type_id'] = $_POST['tr_type_id'];
	$params['subject_death_certificate'] = $_POST['death_certificate'];*/

	foreach($_POST as $key => $value)
	{
		$params[$key] = $value;
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

$oInheritance = new Inheritances();
$oTransactionRelationship = new Transaction_Relationships();
$oParty = new Transaction_Relationship_Parties();
$oSubject = new Transaction_Relationship_Party_Subjects();
$oObject = new Transaction_Relationship_Objects();

$transactionsResult = $oInheritance->getInheritances($search,$start, $limit);

$inheritances = array();

while($transactionsList = $oInheritance->db_fetch_array($transactionsResult))
{
	$inheritances[] = array(
		'id' => $transactionsList['id'],
		'relationships' => $relationships,
		'notary' => $transactionsList['notary'],
		'transaction_code' => $transactionsList['transaction_code'],
		'tr_status_code' => $transactionsList['tr_status_code'],
		'tr_status' => $transactionsList['tr_status_title'],
		'locked_user_id' => $transactionsList['locked_user_id'],
		'tr_type_id' => $transactionsList['tr_type_id'],
		'tr_type_label'=> $transactionsList['tr_type_label'],
		'service_fee_coefficient_min' => $transactionsList['service_fee_coefficient_min'],
		'service_fee_coefficient_max' => $transactionsList['service_fee_coefficient_max'],
		'case_code'=> $transactionsList['case_code'],
		'input_user'=> $transactionsList['input_user'],
		'tr_creation_date'=> $transactionsList['lu_date'],
	);
}

if($init == 1)
{
	$total = $oInheritance->getInheritances($search, 0, 0, true);
	$oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
}
else
{
	$total = $oSession->getItem('total', $session_collection_key);
}

Ext::sendResponse(true, array(
	'data' => $inheritances,
	'total' => $total
));

