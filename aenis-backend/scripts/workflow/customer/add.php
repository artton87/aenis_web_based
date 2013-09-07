<?php
user_auth_check(TRUE);
if(Acl()->allowed('customer.add'))
{
	$oCustomers = new Customers();
	$data = App_Json::decode($_POST['params'], TRUE);
	$customer_id = $oCustomers->addCustomer($data);
	$oCustomers->db_commit();
	Ext::sendResponse(true, array(
		'data' => $customer_id
	));
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ օգտվողին ավելացնելու համար:');
}