<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;


	$update_array = array(
		'id'  => $data->id,
		'case_id' => $data->case_id,
		'rel_id' => 0,
		'subject_id' => 0,
		'object_id' => 0,
		'document_description' => $data->document_description,
		'page_count' => $data->page_count,
		'doc_num_in_case' => $data->doc_num_in_case,
		'doc_type_id' => $data->doc_type_id
	);

	//echo "<pre>"; print_r($update_array); echo "</pre>"; exit;
	$o = new Documents();
	if($update_array['id']){
		$ret = $o->updateDocument($update_array);
	} else
		$ret = $o->addDocument($update_array);
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