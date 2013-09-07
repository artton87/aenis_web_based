<?php
/**
 * Transaction relationships management
 * @package aenis
 */

/**
 * Contains methods for transaction relationships management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Relationships extends HistoricalTable
{
	/**
	 * Table name as in database. Implementation of HistoricalTable.
	 * @var string
	 */
	protected $_table = 'relationships';


        
        
        

        /**
	 * Returns relationships
	 * @access public
	 * @param array $search    Optional. Array with the following search criteria:
	 * 						   relationship_id, transaction_id
	 * @return mysqli_result
	 */
	public function getRelationships($search = array())
	{
		$where = array();
		$joins = array();

		if(empty($search['relationship_id']))
		{
			$where[] = 'rel.del_user_id IS NULL';
			$where[] = 'rel.new_id IS NULL';
		}
		else
		{
			$where[] = "rel.id = '".intval($search['relationship_id'])."'";
		}

		if(!empty($search['transaction_id']))
		{
			$where[] = "tr.id = '".intval($search['transaction_id'])."'";
			$joins[] = 'JOIN bs_transactions tr ON tr.id = rel.tr_id AND tr.del_user_id IS NULL AND tr.new_id IS NULL';
		}

		$where = implode(' AND ', $where);
		$joins = implode(PHP_EOL, array_unique($joins));

		$q = "SELECT
				rel.*
            FROM bs_relationships rel
            $joins
            WHERE $where
        ";
		return $this->db_query($q);
	}


	/**
	 * Add new relationship
	 * @param array $data     Associative array with 'relationships' database table field values
	 * @return integer
	 */
	public function addRelationship($data)
	{
		$insert_data = App_Array::pick($data, 'tr_id');
		return $this->insertUsingAdjacencyListModel($insert_data);
	}


	/**
	 * Handles files uploaded for this relationship
	 * @access public
	 * @param integer $rel_id   Relationship id
	 * @param integer $case_id    Case id to be passed to addDocument
	 * @param array $existing_files    Array with information about existing files (doc_type_id and file_id)
	 * @param object $info    Uploaded files info
	 */
	public function handleRelationshipUploadedFiles($rel_id, $case_id, $existing_files, $info)
	{
		$oDoc = new Documents();
		$oDocFiles = new Document_Files();
		foreach($existing_files as $existing_file)
		{
			if($existing_file['file_id'] == 0) continue; //skip uploaded files
			$doc_dt_id = $oDoc->addDocument(array(
				'rel_id' => $rel_id,
				'doc_type_id' => $existing_file['doc_type_id'],
				'case_id' => $case_id,
                'insert_type' =>1
			))->dt_id;
			$oDocFiles->addDocumentFile($doc_dt_id, $existing_file['file_id']);
		}

		$files_backup = $_FILES;
		$_FILES = $info->files;
		foreach($_FILES as $key=>$file)
		{
			$doc_dt_id = $oDoc->addDocument(array(
				'rel_id' => $rel_id,
				'doc_type_id' => $info->fileKey_docTypeId_map[$key],
				'case_id' => $case_id,
                'insert_type' =>1
			))->dt_id;
            $result = $this->db_select('cases',array('case_code'), array('id'=>$case_id));
            if($row = $this->db_fetch_row($result))
            {
                $case_code = $row[0];
            }
			$oDocFiles->insert($doc_dt_id, array($key=>$file), $case_code);
		}
		$_FILES = $files_backup;
	}
}
