<?php
user_auth_check();

$password_old = urldecode($_POST['password_old']);
$password_new = urldecode($_POST['password_new']);
$password_new_repeat = urldecode($_POST['password_new_repeat']);

$oUsers = new Users();
try {
	if(empty($password_old))
		throw new App_Exception_Validate('Հին գաղտնաբառը նշված չէ:');
		
	if(empty($password_new))
		throw new App_Exception_Validate('Նոր գաղտնաբառը նշված չէ:');

	if($password_new != $password_new_repeat)
		throw new App_Exception_Validate('Կրկին հավաքեք նոր գաղտնաբառը:');
	
	if(Acl()->denied('profile.password.change'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գաղտնաբառի փոփոխման համար:');
	
	$oUsers->setPassword(App_Registry::get('temp_sn')->user_id, $password_old, $password_new);
	$oUsers->db_commit();
	
	Ext::sendResponse(true, array());
	
}
catch(App_Exception_NonCritical $e)
{
	$oUsers->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}

