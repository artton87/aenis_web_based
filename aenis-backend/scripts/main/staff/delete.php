<?php
user_auth_check();


$req = json_decode($_POST['data']);
$id = $req->id;
	
try {
	$o = null;
	if(!empty($id))
	{
		if(Acl()->denied('staff.delete'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ պաշտոնի հեռացման համար:');
		
		$o = new Staff();
		$o->deleteMember($id);
		$o->db_commit();
		
		Ext::sendResponse(true, array());
	}
}
catch(App_Db_Exception_RowIsReferenced $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse('Պաշտոնը հնարավոր չէ հեռացնել, քանի որ կան կապված գրառումներ');
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}

