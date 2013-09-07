<?php
user_auth_check();

//throw new App_Exception_NonCritical('hello');
$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$data['id'] = (isset($_POST['id'])) ? $_POST['id'] : 0;
	$data['page_id'] = (isset($_POST['page_id'])) ? $_POST['page_id'] : 0;

	$update_array = App_Array::pick($_POST,array(
		'page_number_in_document',
		'page_format_id'
	));

	$update_array += App_Array::pick($data,array(
		'id',
		'page_id',
		'doc_id'
	));

	$o = new Document_Pages();


//	if ($update_array['id'] == 0){
		$result = $o->getUniquePageNumber($update_array);
		if ($row = $o->db_fetch_row($result)){
			if ($row[0] > 0){
				throw new App_Exception_NonCritical('Այս համարով էջ արդեն գոյություն ունի');
			}
		}
//	}
//	else{
//	}


	/*$update_array = array(
		'id'  => $data->id,
		'doc_id' => $data->doc_id,

		'page_number_in_document' => $data->page_number_in_document,
		'page_format_id' => $data->page_format_id
	);*/

	//echo "<pre>"; print_r($update_array); echo "</pre>"; exit;

	if($update_array['id']){
		$ret = $o->updatePage($update_array);
	} else
		$ret = $o->addPage($update_array);
	$o->db_commit();

	$files = new Document_Page_Files();
	$files->insert($ret->dt_id, $_FILES);
	$files->db_commit();

	Ext::sendResponse(true, array(
		'data' =>array('id' => $ret->id)
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}