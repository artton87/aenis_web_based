<?php

user_auth_check();
$oDocument = null;
$user_id = App_Registry::get('temp_sn')->user_id;
$filters = App_Json::decode($_REQUEST['filter'], true);
//print_r($filters); exit;


if(!empty($_POST['id']))
{
	$items = array();
	$search['document_id'] = $_POST['id'];
	$oDocument = new Documents();
	$results = $oDocument->getDocuments($search);
	if($row = $oDocument->db_fetch_array($results))
	{
		$result = $oDocument->getPagesCount(array('doc_id'=>$row['id']));
		$attached = 0;
		if ($row1 = $oDocument->db_fetch_row($result)){
			$attached = $row1[0];
		}
		$items[] = array(
			'id' => $row['id'],
			'attached' => $attached
		);
	}
}

else
{
	$search = array();
	foreach($filters as $filter)
	{
		$search[$filter['property']] = $filter['value'];
	}
	$items = array();


	if ($search){
		$oDocument = new Documents();
		$results = $oDocument->getDocuments($search);
		//var_dump($results); exit;
		while($row = $oDocument->db_fetch_array($results)){
			$result = $oDocument->getPagesCount(array('doc_id'=>$row['id']));
			$attached = 0;
			if ($row1 = $oDocument->db_fetch_row($result)){
				$attached = $row1[0];
			}

			$items[] = array(
				'id' => $row['id'],
				'case_id' => $row['case_id'],
				'dt_id' => $row['dt_id'],
				'rel_id' => $row['rel_id'],
				'object_id' => $row['object_id'],
				'subject_id' => $row['subject_id'],
				'page_count' => $row['page_count'],
				'doc_num_in_case' => $row['doc_num_in_case'],
				'doc_type_label' => $row['doc_type_label'],
				'doc_type_id' => $row['doc_type_id'],
				'document_description' => $row['document_description'],
				'attached' => $attached,
				'has_file' => ($row['doc_file_id']) ? 1 : 0
			);
		}
	}


}

Ext::sendResponse(true, array(
	'data' => $items
));

