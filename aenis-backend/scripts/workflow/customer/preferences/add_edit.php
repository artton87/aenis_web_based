<?php
user_auth_check(TRUE);
if(Acl()->allowed('customer.preferences.edit'))
{
	$oPreferences = new Customer_Preferences();
	$preferences = App_Json::decode($_POST['params'], TRUE);
	$oPreferences->addPreferences($preferences);
	$oPreferences->db_commit();
	Ext::sendResponse(true, array());
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ օգտվողի նախապատվությունները խմբագրելու համար:');
}