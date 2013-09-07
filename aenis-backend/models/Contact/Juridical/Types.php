<?php
/**
 * Juridical contact types management
 * @package aenis\Contact
 */

/**
 * Methods for juridical contact types management
 * @author BestSoft
 * @package aenis\Contact
 */
class Contact_Juridical_Types extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'contact_jp_types';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'j_contact_organization_types';

	
	/**
     * Returns list of juridical contact types
     * @access public
	 * @param array $search     Associative array with search parameters
     * @return mysqli_result|resource
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
     * Validates juridical contact type fields
     * @access protected
     * @param integer $type_id    Type ID
     * @param array $data   Associative array with type fields
	 * @throws App_Db_Exception_Validate is some of fields do not pass validation
     */
    protected function validateType($type_id, $data)
    {
        if(empty($data['name']))
        	throw new App_Db_Exception_Validate('Կազմակերպա-իրավական տեսակի անվանումը լրացված չէ:');

        $where = array('name' => $data['name']);
        if(!empty($type_id))
        	$where[] = "id <> $type_id";
        $result = $this->db_select($this->_table, array('id'), $where, array(), 1);
        if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Կազմակերպա-իրավական տեսակի անվանումը կրկնվում է:');
    }
    
    
    /**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with juridical contact type fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
		return array(
        	'name' => $data['name'],
        	'abbreviation' => $data['abbreviation']
        );
    }
    
    
    /**
     * Adds new juridical contact type
     * @access public
     * @param array $data    Associative array with juridical contact type fields
	 * @return integer    ID of newly added juridical contact type
     */
	public function addType($data)
	{
		$this->validateType(0, $data);
        
        $insert_data = $this->getDbFields($data);
        
        $this->db_insert($this->_table, $insert_data);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $this->db_insert_id();
	}
	
	
	/**
     * Edit existing juridical contact type
     * @access public
     * @param integer $type_id    Type ID
     * @param array $data    Associative array with juridical contact type fields
	 * @throws App_Db_Exception_Table if juridical contact type id is not specified
     */
    public function updateType($type_id, $data)
    {
        if(empty($type_id))
        	throw new App_Db_Exception_Table('Juridical contact type ID is not specified');
        $this->validateType($type_id, $data);
        
        $update_data = $this->getDbFields($data);

        $this->db_update($this->_table, $update_data, array('id'=>$type_id));
		App_Cache()->refreshTags(self::CACHE_TAG);
    }
	
	
	/**
	 * Deletes juridical contact type with given ID
	 * @access public
	 * @param string $id    Type ID
	 * @throws App_Db_Exception_Table if juridical contact type id is not specified
	 */
	public function deleteType($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Juridical contact type ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
