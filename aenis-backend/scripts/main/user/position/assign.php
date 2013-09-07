<?php
user_auth_check();

$o = null;
try{
	if(Acl()->denied('user.staff.add'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ օգտվողին պաշտոնին նշանակելու համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);

    $o = new User_Positions();
	$id = $o->assignToPosition($data->user_id, $data->staff_id);
    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id)
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
