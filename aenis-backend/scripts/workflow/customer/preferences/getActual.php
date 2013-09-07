<?php
user_auth_check(TRUE);
if(Acl()->allowed('customer.preferences.get'))
{
	$oPreferences = new Customer_Preferences();
	$customer_id = App_Json::decode($_POST['params'], TRUE);
	$result = $oPreferences->getActualPreferences($customer_id);
	$preferences = array();
	if($row = $oPreferences->db_fetch_array($result))
	{
		$preferences = $row;             
	}
	if(empty($preferences['notary_view_mode']))
	{
		$preferences['notary_view_mode'] = Customer_Preferences::NOTARY_VIEW_MODE_EXTENDED;
	}
	Ext::sendResponse(true, array('data' => $preferences));
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ կայքի օգտվողների նախապատվությունները ստանալու համար:');
}