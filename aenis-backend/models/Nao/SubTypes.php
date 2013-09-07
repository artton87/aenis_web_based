<?php
/**
 * Nao subtypes management
 * @package aenis\Classifiers
 */

/**
 * Contains methods for nao subtypes management
 * @author BestSoft
 * @package aenis\Classifiers
 */
class Nao_SubTypes extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'sub_nao_types';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'sub_nao_types';


	/**
     * Returns list of sub nao types
     * @access public
	 * @param array $search     Associative array with search parameters
     * @return mysqli_result
     */
	public function getTypes(array $search = array())
	{
		$where = array();

		if(!empty($search['id']))
			$where[] = 'tbl.id = '.intval($search['id']);

		$where = (count($where)>0) ? ' WHERE '.implode(' AND ', $where) : '';

		$q = "SELECT
				tbl.*
        	FROM bs_{$this->_table} tbl
			$where
        ";
		return $this->db_query($q);
	}


	/**
	 * Checks correctness of sub nao type input fields
	 * @access public
	 * @param array $data    Associative array with 'sub_nao_types' database table field values
	 * @param integer $id    Sub nao type ID
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
	 */
	protected function validateType($data, $id=0)
	{
		if(empty($data['label']))
			throw new App_Db_Exception_Validate('Ենթա-ՆԱՕ տեսակի անվանումը տրված չէ');

		$where = array('label'=>$data['label']);
		if(!empty($id))
			$where[] = 'id <>'.intval($id);

		$result = $this->db_select($this->_table, array('id'), $where);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ անվանումով ենթա-ՆԱՕ տեսակ արդեն մուտքագրված է');
	}


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with sub nao type fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'label' => $data['label']
		);
	}


	/**
	 * Add new sub nao type
	 * @access public
	 * @param array $data    Associative array with 'sub_nao_types' database table field values
	 */
	function addType($data)
	{
		$this->validateType($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $this->db_insert_id();
	}


	/**
	 * Edit an existing sub nao type
	 * @access public
	 * @param integer $id     Sub nao type ID
	 * @param array $data    Associative array with 'sub_nao_types' database table field values
	 * @throws App_Db_Exception_Table if sub nao type id is not specified
	 */
	function updateType($id, $data)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Sub nao type ID is not specified');

		$this->validateType($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}


	/**
	 * Removes sub nao type with the given ID
	 * @access public
	 * @param integer $id    Sub nao type ID
	 * @throws App_Db_Exception_Table if sub nao type id is not specified
	 */
	function deleteType($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Sub nao type ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
