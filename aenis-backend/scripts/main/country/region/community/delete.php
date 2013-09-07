<?php
user_auth_check();

$o = null;
try{
	if(Acl::instance()->denied('community.edit'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ համայնքի հեռացման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

    $o = new Country_Region_Communities();
    $o->deleteCommunity($id);
    $o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
