<?php
/**
 * Transaction property type values management
 * @package aenis
 */

/**
 * Contains methods for transaction property type values management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Property_Type_Values extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'transaction_property_type_values';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'transaction_property_type_values';


	/**
     * Returns list of transaction property type values with detailed information about them
     * @access public
     * @param array $search    Associative array with search parameters
     * @return mysqli_result|resource
     */
    public function getValues(array $search = array())
    {
		$where = array();
		if(!empty($search['id']))
			$where[] = "tbl.id='".intval($search['id'])."'";

		if(!empty($search['tr_property_type_id']))
			$where[] = "tbl.tr_property_type_id='".intval($search['tr_property_type_id'])."'";

		$where = empty($where) ? '' : 'WHERE '.implode(' AND ', $where);

		$q = "SELECT
				tbl.*
			FROM bs_{$this->_table} tbl
			$where
			ORDER BY tbl.label ASC
		";
		return $this->db_query($q);
    }
    
    
    /**
     * Validates transaction property type value fields
     * @access protected
     * @param array $data   Associative array with transaction property type value fields
	 * @param integer $id    Transaction property type value ID
	 * @throws App_Db_Exception_Validate if some of fields do not pass validation
	 * @throws App_Db_Exception_Table if transaction property type ID is not specified
     */
    protected function validateValue($data, $id=0)
    {
		if(empty($data['tr_property_type_id']))
			throw new App_Db_Exception_Table('Transaction property type ID is not specified');

		if(empty($data['label']))
			throw new App_Db_Exception_Validate('Արժեքը լրացված չէ:');

		$where = array('label' => $data['label']);
		if(!empty($id))
			$where[] = "id <> $id";
		$result = $this->db_select($this->_table, array('id'), $where, array(), 1);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Արժեքը կրկնվում է:');
    }
    
    
	/**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with transaction property type value fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
		return array(
        	'label' => $data['label'],
        	'tr_property_type_id' => $data['tr_property_type_id']
        );
    }
    
    
    /**
     * Adds new transaction property type value
     * @access public
     * @param array $data    Associative array with transaction property type value fields
     */
	public function addValue($data)
	{
		$this->validateValue($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		$id = $this->db_insert_id();
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $id;
	}
	
	
	/**
     * Edit existing transaction property type value
     * @access public
     * @param integer $id    Transaction property type value ID
     * @param array $data    Associative array with transaction property type value fields
	 * @throws App_Db_Exception_Table if transaction property type value id is not specified
     */
    public function updateValue($id, $data)
    {
        if(empty($id))
			throw new App_Db_Exception_Table('Transaction property type value ID is not specified');

		$this->validateValue($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
    }


	/**
	 * Deletes transaction property type value with given ID
	 * @access public
	 * @param string $id    Transaction property type value ID
	 * @throws App_Db_Exception_Table if transaction property type value id is not specified
	 */
	public function deleteValue($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Transaction property type value ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
