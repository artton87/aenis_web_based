<?php
user_auth_check();

$o = null;
try{
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);

    $o = new Contact_Natural();
	//$matches = $o->getContactsUsingAvvWebService(array(
	$matches = $o->getContactsFromMergelyan(App_Array::pick($data,
		'first_name', 'last_name', 'second_name'
	));

	$passport = $ssn = null;
	if(1==count($matches))
	{
		$passport = $matches[0]['passport_number'];
		$ssn = $matches[0]['social_card_number'];
	}

	Ext::sendResponse(true, array('passport'=>$passport, 'ssn'=>$ssn));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
