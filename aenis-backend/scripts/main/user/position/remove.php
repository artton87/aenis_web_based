<?php
user_auth_check();

$o = null;
try{
	if(Acl()->denied('user.staff.delete'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ օգտվողին պաշտոնից հեռացնելու համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);

    $o = new User_Positions();
	$info = $o->removeFromPosition($data->user_id, $data->staff_id);

    $o->db_commit();
	Ext::sendResponse(true, array(
		'is_active' => $info['is_active'],
		'leaving_date' => $info['leaving_date']
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
