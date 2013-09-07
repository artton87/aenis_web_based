<?php
$user_id = App_Registry::get('temp_sn')->user_id;

if(null === $user_id)
{
	Ext::sendResponse(false, array());
}
else
{
	$oVariable = new Template_Variable_User_Name_Full();
	$user_full_name = $oVariable->getVariableValue(0);

	$oVariable = new Template_Variable_Notarial_Office_Title();
	$notarial_office_name = $oVariable->getVariableValue(0);

	Ext::sendResponse(true, array(
		'user_id' => $user_id,
		'user_full_name' => $user_full_name,
		'notarial_office_name' => $notarial_office_name,
		'server_date' => date('d/m/Y')
	));
}
