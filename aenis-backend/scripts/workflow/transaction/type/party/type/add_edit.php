<?php
user_auth_check();

$o = null;
try {
	if(Acl()->denied('transaction.type.edit'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի կողմերի տեսակների խմբագրման համար:');

	$data = App_Json::decode($_POST['data']);
	if(!is_array($data))
		$data = array($data);

	$o = new Transaction_Type_Party_Types();
	foreach($data as $record)
	{
		$update_array = array(
			'tr_type_id' => $record->tr_type_id,
			'party_type_id' => $record->party_type_id,
			'is_required' => $record->is_required,
			'order_in_list' => $record->order_in_list
		);
		$o->setRecord($update_array);
	}
    $o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
