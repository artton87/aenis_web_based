<?php
user_auth_check(TRUE);
if(Acl()->allowed('customer.get'))
{
	$oCustomers = new Customers();
	$search = App_Json::decode($_POST['params'], TRUE);
	$result = $oCustomers->getCustomers($search);
	Ext::sendResponse(true, array('data' => $result));
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ օգտվողների տվյալները ստանալու համար:');
}