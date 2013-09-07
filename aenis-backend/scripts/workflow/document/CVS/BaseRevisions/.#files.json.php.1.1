<?php
user_auth_check();

$search = array();
$filters = App_Json::decode($_REQUEST['filter'], true);
foreach($filters as $filter)
{
    $search[$filter['property']] = $filter['value'];
}

$files = array();
if(!empty($search))
{
	$oDocumentFiles = new Document_Files();
    $result = $oDocumentFiles->getFiles($search);
    while($row = $oDocumentFiles->db_fetch_array($result))
    {
        $files[] = array(
            'id' => $row['id'],
            'doc_id' => $row['doc_id'],
            'file_name' => $row['file_name'],
        );
    }

    if(empty($files))
    {
		$oDocumentPageFiles = new Document_Page_Files();

		$oPages = new Document_Pages();
		$resultPages = $oPages->getDocumentPages($search);
		while($rowPages = $oPages->db_fetch_array($resultPages))
		{
			$page_dt_id = $rowPages['id'];

			$result = $oDocumentPageFiles->getFiles(array('page_dt_id' => $page_dt_id));
			while($row = $oDocumentFiles->db_fetch_array($result))
			{
				$files[] = array(
					'id' => $row['id'],
					'doc_id' => $rowPages['doc_id'],
					'file_name' => $row['file_name'],
				);
			}
		}
    }
}

Ext::sendResponse(true, array(
    'data' => $files
));
