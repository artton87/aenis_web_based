<?php
user_auth_check(TRUE);
if(Acl()->allowed('customer.edit'))
{
	$oCustomers = new Customers();
	$data = App_Json::decode($_POST['params'], TRUE);
	$customer_id = $oCustomers->updateCustomers($data['data'], $data['conditions']);
	$oCustomers->db_commit();
	Ext::sendResponse(true, array());
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ օգտվողին ավելացնելու համար:');
}