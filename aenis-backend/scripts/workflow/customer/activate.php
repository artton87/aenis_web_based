<?php
user_auth_check(TRUE);
if(Acl()->allowed('customer.activate'))
{
	$oCustomers = new Customers();
	$key = App_Json::decode($_POST['params'], TRUE);
	$response = $oCustomers->activateCustomer($key);
	$oCustomers->db_commit();
	Ext::sendResponse(true, array('data' => $response));
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ օգտվողին ակտիվացնելու համար:');
}