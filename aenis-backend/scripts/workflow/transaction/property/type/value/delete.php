<?php
user_auth_check();

$o = null;
try{
    if(Acl()->denied('transaction.property.type.value.delete'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի ատրիբուտի արժեքի հեռացման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

    $o = new Transaction_Property_Type_Values();
    $o->deleteValue($id);
    $o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
