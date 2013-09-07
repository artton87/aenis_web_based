<?php
user_auth_check();

$o = null;
try{
	if(Acl()->denied('user.resources.reset'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ օգտվողի անհատական իրավունքների հեռացման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$user_id = $data->user_id;

    $o = new User_Resources();
	$o->resetAll($user_id);
    $o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
