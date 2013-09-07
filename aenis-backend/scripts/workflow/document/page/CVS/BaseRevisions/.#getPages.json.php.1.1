<?php

user_auth_check();

$oPages = null;

$user_id = App_Registry::get('temp_sn')->user_id;

$filters = App_Json::decode($_REQUEST['filter'], true);

//print_r($filters); exit;

$search = array();
if ($filters)
	foreach ($filters as $filter)
	{
		$search[$filter['property']] = $filter['value'];
	}
$items = array();

//if($search){
	$oPages = new Document_Pages();
	$results = $oPages->getDocumentPages($search);
	//var_dump($results); exit;
	while($row = $oPages->db_fetch_array($results)){
		$items[] = array(
			'id' => $row['id'],
			'doc_id' => $row['doc_id'],
			'page_id' => $row['page_id'],
			'page_format_id' => $row['page_format_id'],
			'file_id' => $row['file_id'],
			'page_number_in_document' => $row['page_number_in_document'],
			'page_size' => $row['title']." (".$row['page_size'].')'
		);
	}

//}

//echo "<pre>"; print_r($items); echo "</pre>";
Ext::sendResponse(true, array(
	'data' => $items
));

