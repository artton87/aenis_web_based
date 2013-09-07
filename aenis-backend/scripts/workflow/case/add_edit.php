<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;
	$user_id = App_Registry::get('temp_sn')->user_id;

	$update_array = array(
		'id' => $id,
		'is_all_scanned' => $data->is_all_scanned,
		'notary_user_id' => $data->notary_id,
		'input_user_id' => $user_id,
	);

	//echo "<pre>"; print_r($update_array); echo "</pre>"; exit;
	$o = new Cases();
	if($id){
		$ret = $o->updateCase($update_array);
	} else
		$ret = $o->addCase($update_array);
	$o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $ret->id)
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}