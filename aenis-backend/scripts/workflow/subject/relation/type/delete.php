<?php
user_auth_check();

$o = null;
try{
	if(Acl::instance()->denied('subject.relation.type.edit'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ սուբյեկտի հարաբերության տեսակի հեռացման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

    $o = new Subject_Relation_Types();
    $o->deleteType($id);
    $o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
