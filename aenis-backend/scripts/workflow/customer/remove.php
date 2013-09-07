<?php
user_auth_check(TRUE);
if(Acl()->allowed('customer.remove'))
{
	$oCustomers = new Customers();
	$id = App_Json::decode($_POST['params'], TRUE);
	$oCustomers->removeCustomer($data);
	$oCustomers->db_commit();
	Ext::sendResponse(true, array());
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ օգտվողին հեռացնելու համար:');
}