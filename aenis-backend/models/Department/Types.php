<?php
/**
 * Department types management
 * @package aenis\Structure
 */

/**
 * Contains methods for department types management
 * @author BestSoft
 * @package aenis\Structure
 */
class Department_Types extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'department_types';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'department_types';


	/**
     * Returns list of department types
     * @access public
     * @return mysqli_result
     */
	public function getTypes()
	{
		return $this->db_select($this->_table, array());
	}


	/**
	 * Checks correctness of department type input fields
	 * @access public
	 * @param array $data    Associative array with 'department_types' database table field values
	 * @param integer $id    Department type ID
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
	 */
	protected function validateType($data, $id=0)
	{
		if(empty($data['title']))
			throw new App_Db_Exception_Validate('Ստորաբաժանման տեսակի անվանումը տրված չէ');

		$where = array('title'=>$data['title']);
		if(!empty($id))
			$where[] = 'id <>'.intval($id);

		$result = $this->db_select($this->_table, array('id'), $where);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ անվանումով ստորաբաժանման տեսակ արդեն մուտքագրված է');
	}


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with department type fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'title' => $data['title']
		);
	}


	/**
	 * Add new department type
	 * @access public
	 * @param array $data    Associative array with 'department_types' database table field values
	 */
	function addType($data)
	{
		$this->validateType($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $this->db_insert_id();
	}


	/**
	 * Edit an existing department type
	 * @access public
	 * @param integer $id     Department type ID
	 * @param array $data    Associative array with 'department_types' database table field values
	 * @throws App_Db_Exception_Table if department type id is not specified
	 */
	function updateType($id, $data)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Department type ID is not specified');

		$this->validateType($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}


	/**
	 * Removes department type with the given ID
	 * @access public
	 * @param integer $id    Department type ID
	 * @throws App_Db_Exception_Table if department type id is not specified
	 */
	function deleteType($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Department type ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
