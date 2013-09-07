<?php
/**
 * Document pages management
 * @package aenis
 */

/**
 * Methods for working with document pages
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Document_Pages extends App_Db_Table_Abstract
{
    /**
     * Add a new page
     * @param $data    Array with fields of 'pages' and 'pages_dt' tables as in DB
     * @return Table_Insert_Result
     */
    public function addPage($data)
    {
        $this->db_insert('pages',array(
            'doc_id' => $data['doc_id'],
			'lu_user_id' => App_Registry::get('temp_sn')->user_id,
            'lu_date' => self::$DB_TIMESTAMP
        ));
        $page_id = $this->db_insert_id();

        $this->db_insert('pages_dt',array(
            'page_id' => $page_id,
			'page_format_id' => $data['page_format_id'],
			'page_number_in_document' => $data['page_number_in_document'],
            'is_copy' => 0,
            'is_last' => 1,
            'lu_user_id' => App_Registry::get('temp_sn')->user_id,
            'lu_date' => self::$DB_TIMESTAMP
        ));
        return new Table_Insert_Result($page_id, $this->db_insert_id());
    }

	/**
	 * Update a page
	 * @param array $data     Associative array with 'page' database table field values
	 * @return Table_Insert_Result
	 */
	public function updatePage($data)
	{
		$this->db_update(
			'pages_dt',
			array('is_last' => 0),
			array('id' => $data['id'])
		);

		$this->db_insert('pages_dt',array(
			'page_id' => $data['page_id'],
			'page_format_id' => $data['page_format_id'],
			'page_number_in_document' => $data['page_number_in_document'],
			'is_copy' => 0,
			'is_last' => 1,
			'lu_user_id' => App_Registry::get('temp_sn')->user_id,
			'lu_date' => self::$DB_TIMESTAMP
		));
		return new Table_Insert_Result($data['id'], $this->db_insert_id());

	}

	/**
	 * list of all page formats
	 * @return mysqli_result
	 */
	public function getPageFormats(){
		$q = "SELECT * FROM bs_page_formats";
		return $this->db_query($q);
	}

	/**
	 * all pages of a document
	 */
	public function getDocumentPages($search)
	{
		$where = array(
			'pages.is_deleted = 0'
		);
		$joins = array();

		if(!empty($search['doc_id']))
			$where[] = "pages.doc_id = '".intval($search['doc_id'])."'";

		$where = implode(' AND ', $where);
		$joins = implode(PHP_EOL, array_unique($joins));

		$q = "SELECT
				pages.id as page_id,
				pages.doc_id,
				p_dt.id as id,
				pages.is_deleted,
				pages.lu_user_id,
				pages.lu_date,
				p_dt.page_number_in_document,
				p_dt.page_format_id,
				p_dt.is_last ".",
				formats.title,
				formats.page_size,
				p_files.`file_id`,
				bs_files.`file_name`,
				bs_files.`storage_id`
			FROM bs_pages pages
            JOIN bs_pages_dt p_dt ON pages.id = p_dt.page_id AND p_dt.is_last = 1
            LEFT JOIN bs_page_files p_files ON p_files.`page_data_id` = p_dt.id
  			LEFT JOIN bs_files ON bs_files.`id`= p_files.`file_id`
            LEFT JOIN bs_page_formats formats ON formats.id = p_dt.page_format_id
             $joins
            WHERE $where
			";
		return $this->db_query($q);
	}

	/**
	 * Returns pages count for a document with a certain page number
	 * @access public
	 * @param array $search    Array with search criteria:
	 * @throws App_Db_Exception_Table if $search is not specified
	 */
	public function getUniquePageNumber($search){
		$where = array();
		if(!empty($search['doc_id']))
			$where[] = "pages.doc_id = ".intval($search['doc_id']);
		if(!empty($search['page_number_in_document']))
			$where[] = "pages_dt.page_number_in_document = ".intval($search['page_number_in_document']);
		if(!empty($search['id']))
			$where[] =  "pages_dt.id != ".$search['id'];

		if(count($where))
			$where = implode(' AND ', $where);

		$q = "SELECT COUNT(pages_dt.id)
			FROM bs_pages pages
			LEFT JOIN bs_pages_dt pages_dt ON pages_dt.page_id = pages.id
			AND pages.is_deleted=0 AND pages_dt.is_last = 1
			WHERE $where
			";
		return $this->db_query($q);
	}


}
