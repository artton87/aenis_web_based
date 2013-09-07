<?php
user_auth_check();

$office_id = $_POST['office_id'];
if(empty($office_id))
{
	if(Acl()->allowed('login_without_notarial_office_selection'))
	{
		Ext::sendResponse(true, array(
			'notarial_office_id' => 0,
			'notarial_office_name' => ''
		));
		exit;
	}
}
else
{
	$notarial_office_id = intval($office_id);
	App_Registry::get('temp_sn')->notarial_office_id = $notarial_office_id;

	$oVariable = new Template_Variable_Notarial_Office_Title();
	$notarial_office_name = $oVariable->getVariableValue(0);

	Ext::sendResponse(true, array(
		'notarial_office_id' => $notarial_office_id,
		'notarial_office_name' => $notarial_office_name
	));
	exit;
}

Ext::sendErrorResponse('Նոտարական գրասենյակը ընտրված չէ');
