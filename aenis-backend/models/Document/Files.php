<?php
/**
 * Document files management
 * @package aenis
 */

/**
 * Methods for working with document files
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Document_Files extends Files
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'document_files';


	/**
	 * Add new document file
	 * @param integer $doc_dt_id     Document data id
	 * @param integer $file_id     File id
	 * @return integer    Id of newly inserted record
	 */
	public function addDocumentFile($doc_dt_id, $file_id)
	{
		$this->db_insert($this->_table,
			array(
				'doc_dt_id' => $doc_dt_id,
				'file_id' => $file_id
			)
		);
		return $this->db_insert_id();
	}


    /**
     * Place uploaded file into storage and in DB
     * @access public
     * @param integer $doc_dt_id    Document data id
     * @param array $files    $_FILES array or some of its elements
     * @param string $sub_dir    Optional. Sub-directory where file will be placed
     * @param bool $verify_signature    Optional. If true, checks for valid signature
     * @throws App_Exception|Exception
	 * @throws App_Db_Exception_Validate if $verify_signature=true and signature validation fails
     * @return integer
     */
	public function insert($doc_dt_id, $files, $sub_dir='', $verify_signature = false)
	{
		//transfer uploaded files
		$max_possible_size = App_File_Utils::get_upload_max_file_size_setting();

		//add validators
		$oSequenceValidators = new App_Sequence_Validators();
		$oSequenceValidators->add(array(
			//new App_Validate_File_Exists('Ֆայլը բեռնավորված չէ'),
			new App_Validate_File_SizeMax($max_possible_size, 'Ֆայլի չափը ավելի մեծ է քան մաքսիմալ թույլատրելի չափը` '.$max_possible_size.' բայտ:'), //10MB
		    new App_Validate_File_Extension(array('pdf'), 'Կցված ֆայլը PDF չէ:')
        ));
		/*if($verify_signature)
		{
			$user_data = App_Registry::get('temp_sn')->user_data;
			$oSequenceValidators->add(array(
				new App_Validate_File_Extension(array('pdf'), 'Կցված ֆայլի ընդլայնումը PDF չէ: Կցեք ստորագրված PDF ֆայլ:'),
				new App_Validate_File_Type('pdf', 'Կցեք ֆայլը PDF չէ: Կցեք ստորագրված PDF ֆայլ:'),
				new App_Validate_File_Signature_Cosign($user_data['passport'], $user_data['ssn'], 'Էլեկտրոնային ստորագրությունը սխալ է:')
			));
		}*/

		//prepare transfer object
		$oTransfer = new App_File_Transfer();
		$oTransfer->setValidatorSequence($oSequenceValidators);

		try {
			$oTransfer->transfer(array_keys($files), $sub_dir, $doc_dt_id, false, array());
		}
		catch(App_Exception $e)
		{
			$oTransfer->rollbackTransfer();
			throw $e; //rethrow exception for other classes
		}

		//insert to database
		$oFiles = new Files();
		$transferred_files = $oTransfer->getTransferredFiles();
		foreach($transferred_files as $tfi)
		{
            $file_id = $oFiles->insert($tfi->name, $tfi->path, $tfi->location->getKey());
            $this->addDocumentFile($doc_dt_id, $file_id);
		}
		return true;
	}

    /**
     *Copy existing image for transaction into historical transaction 
     * 
     * 
     * @param type $doc_dt_id
     * @param type $file_id
     * @param type $case_id 
     */
    public function update($doc_dt_id,$file_id)
    {      
        $this->addDocumentFile($doc_dt_id, $file_id);
    }

        /**
     * Returns list of document files
	 * @access public
	 * @param array $search    Array with search criteria. Accepted parameters are:
	 * 						   'doc_id', 'doc_dt_id'
     * @return mysqli_result
     */
    public function getFiles($search)
    {
		$where = array();
		$joins = array();

		if(!empty($search['doc_dt_id']))
			$where[] = "doc_files.doc_dt_id = '".intval($search['doc_dt_id'])."'";

		if(!empty($search['doc_id']))
			$where[] = "doc_dt.doc_id = '".intval($search['doc_id'])."'";

		$where = empty($where) ? '' : 'WHERE '.implode(' AND ', $where);
		$joins = implode(PHP_EOL, array_unique($joins));

		$q = "SELECT
				files.*,
				doc_files.doc_dt_id,
				doc_dt.doc_id
            FROM bs_document_files doc_files
            JOIN bs_files files ON files.id = doc_files.file_id
            JOIN bs_documents_dt doc_dt ON doc_dt.id = doc_files.doc_dt_id AND doc_dt.is_last = 1
            $joins
            $where
        ";
		return $this->db_query($q);
    }
}
