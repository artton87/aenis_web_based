<?php
user_auth_check();

$o = null;
try{
	if(Acl()->denied('role.delete'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ իրավունքների խմբի հեռացման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

    $o = new Roles();
	$o->deleteRole($id);
    $o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Db_Exception_RowIsReferenced $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse('Իրավունքերի խումբը հնարավոր չէ հեռացնել, քանի որ կան կապված գրառումներ');
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
