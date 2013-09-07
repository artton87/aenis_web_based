<?php
/**
 * Transaction property types management
 * @package aenis
 */

/**
 * Contains methods for transaction property types management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Property_Types extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'transaction_property_types';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'transaction_property_types';


	/**
     * Returns list of transaction property types with detailed information about them
     * @access public
     * @param array $search    Associative array with search parameters
	 * @param boolean $include_root_types    Optional. Whenever to include types, which only root can see
     * @return mysqli_result|resource
     */
    public function getTypes(array $search = array(), $include_root_types = false)
    {
		$where = array();
		if(!empty($search['id']))
			$where[] = "tbl.id='".intval($search['id'])."'";

		if(!empty($search['code']))
			$where[] = "tbl.code = '".$this->db_escape_string($search['code'])."'";

		if(!$include_root_types)
			$where[] = 'tbl.code IS NULL';

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
	 * Returns transaction property type id by the given code or id
	 * @access public
	 * @param string|integer $property    Either property code or id
	 * @return Transaction_Property_Type_Info    Info of found type or null
	 */
	public function getTypeInfo($property)
	{
		$search = array();
		if(is_numeric($property))
			$search['id'] = $property;
		else
			$search['code'] = $property;

		$result = $this->getTypes($search, true);
		if($row = $this->db_fetch_array($result))
		{
			return new Transaction_Property_Type_Info($row['type'], $row['id'], $row['code'], $row['code_group']);
		}
		return null;
	}
    
    
    /**
     * Validates transaction property type fields
     * @access protected
     * @param array $data   Associative array with transaction property type fields
	 * @param integer $type_id    Transaction property type ID
	 * @throws App_Db_Exception_Validate if some of fields do not pass validation
     */
    protected function validateType($data, $type_id=0)
    {
		if(empty($data['label']))
			throw new App_Db_Exception_Validate('Գործարքի ատրիբուտի անվանումը լրացված չէ:');

		if(empty($data['type']))
			throw new App_Db_Exception_Validate('Գործարքի ատրիբուտի տեսակն ընտրված չէ:');

		$where = array('label' => $data['label']);
		if(!empty($type_id))
			$where[] = "id <> $type_id";
		$result = $this->db_select($this->_table, array('id'), $where, array(), 1);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Գործարքի ատրիբուտի անվանումը կրկնվում է:');

		if(!empty($data['code']))
		{
			$where = array('code' => $data['code']);
			if(!empty($type_id))
				$where[] = "id <> $type_id";
			$result = $this->db_select($this->_table, array('id'), $where, array(), 1);
			if($row = $this->db_fetch_array($result))
				throw new App_Db_Exception_Validate('Գործարքի ատրիբուտի կոդը կրկնվում է:');
		}
    }
    
    
	/**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with transaction property type fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
		return array(
        	'label' => $data['label'],
        	'code' => empty($data['code']) ?  self::$DB_NULL : $data['code'],
			'type' => $data['type']
        );
    }
    
    
    /**
     * Adds new transaction property type
     * @access public
     * @param array $data    Associative array with transaction property type fields
     */
	public function addType($data)
	{
		$this->validateType($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		$id = $this->db_insert_id();
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $id;
	}
	
	
	/**
     * Edit existing transaction property type
     * @access public
     * @param integer $id    Transaction property type ID
     * @param array $data    Associative array with transaction property type fields
	 * @throws App_Db_Exception_Table if transaction property type id is not specified
     */
    public function updateType($id, $data)
    {
        if(empty($id))
			throw new App_Db_Exception_Table('Transaction property type ID is not specified');

		$this->validateType($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
    }


	/**
	 * Deletes transaction property type with given ID
	 * @access public
	 * @param string $id    Transaction property type ID
	 * @throws App_Db_Exception_Table if transaction property type id is not specified
	 */
	public function deleteType($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Transaction property type ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
