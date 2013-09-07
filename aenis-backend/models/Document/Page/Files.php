<?php
/**
 * Page files management
 * @package aenis
 */

/**
 * Methods for working with page files
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Document_Page_Files extends Files
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'page_files';


	/**
	 * Add new page file
	 * @param integer $page_dt_id     Page data id
	 * @param integer $file_id     File id
	 * @return integer    Id of newly inserted record
	 */
	public function addPageFile($page_dt_id, $file_id)
	{
		$this->db_insert($this->_table,
			array(
				'page_data_id' => $page_dt_id,
				'file_id' => $file_id
			)
		);
		return $this->db_insert_id();
	}


    /**
     * Place uploaded file into storage and in DB
     * @access public
     * @param integer $page_dt_id    Page data id
     * @param array $files    $_FILES array or some of its elements
     * @param string $sub_dir    Optional. Sub-directory where file will be placed
     * @throws App_Exception|Exception
     * @return integer
     */
	public function insert($page_dt_id, $files, $sub_dir='')
	{
		//transfer uploaded files
		$max_possible_size = App_File_Utils::get_upload_max_file_size_setting();

		//add validators
		$oSequenceValidators = new App_Sequence_Validators();
		$oSequenceValidators->add(array(
			new App_Validate_File_Exists('Ֆայլը բեռնավորված չէ'),
			new App_Validate_File_SizeMax($max_possible_size, 'Ֆայլի չափը ավելի մեծ է քան մաքսիմալ թույլատրելի չափը` '.$max_possible_size.' բայտ:') //10MB
		));

		//prepare transfer object
		$oTransfer = new App_File_Transfer();
		$oTransfer->setValidatorSequence($oSequenceValidators);

		try {
			$oTransfer->transfer(array_keys($files), $sub_dir, $page_dt_id, false, array());
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
            $this->addPageFile($page_dt_id, $file_id);
		}
		return true;
	}


	/**
	 * Returns list of page files
	 * @access public
	 * @param array $search    Array with search criteria. Accepted parameters are:
	 * 						   'doc_id', 'doc_dt_id', 'page_id', 'page_dt_id'
	 * @return mysqli_result
	 */
	public function getFiles($search)
	{
		$where = array();
		$joins = array();

		if(!empty($search['page_dt_id']))
			$where[] = "page_files.page_data_id = '".intval($search['page_dt_id'])."'";

		if(!empty($search['page_id']))
			$where[] = "pages_dt.page_id = '".intval($search['page_id'])."'";

		if(!empty($search['doc_id']))
		{
			$where[] = "pages.doc_id = '".intval($search['doc_id'])."'";
			$joins[] = 'JOIN bs_pages pages ON pages.id = pages_dt.page_id AND pages.is_deleted = 0';
		}

		$where = empty($where) ? '' : 'WHERE '.implode(' AND ', $where);
		$joins = implode(PHP_EOL, array_unique($joins));

		$q = "SELECT
				files.*,
				page_files.page_data_id AS page_dt_id,
				pages_dt.page_id
            FROM bs_page_files page_files
            JOIN bs_files files ON files.id = doc_files.file_id
            JOIN bs_pages_dt pages_dt ON pages_dt.id = page_files.page_data_id AND pages_dt.is_last = 1
            $joins
            $where
        ";
		return $this->db_query($q);
	}
}
