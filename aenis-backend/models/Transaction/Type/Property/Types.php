<?php
/**
 * Transaction type property types management
 * @package aenis\Classifiers
 */

/**
 * Contains methods for transaction type property types management
 * @author BestSoft
 * @package aenis\Classifiers
 */
class Transaction_Type_Property_Types extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'transaction_type_property_types';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'transaction_type_property_types';


	/**
     * Returns list of property types
     * @access public
	 * @param array $search     Associative array with search parameters
     * @return mysqli_result
     */
	public function getRecords(array $search)
	{
		$where = array();

		if(!empty($search['tr_type_id']))
			$where[] = "tbl.tr_type_id = '".intval($search['tr_type_id'])."'";

		$where = (count($where)>0) ? ' WHERE '.implode(' AND ', $where) : '';

		$q = "SELECT
				tbl.*,
				property_types.label AS property_type_label,
				property_types.code AS property_type_code,
				property_types.type AS property_type
        	FROM bs_{$this->_table} tbl
        	JOIN bs_transaction_property_types property_types ON property_types.id = tbl.property_type_id
			$where
			ORDER BY tbl.order_in_list ASC
        ";
		return $this->db_query($q);
	}


	/**
	 * Add new property type
	 * @access public
	 * @param array $data    Associative array with 'transaction_type_property_types' database table field values
	 * @throws App_Db_Exception_Table if some critical fields are not given
	 */
	function setRecord($data)
	{
		if(empty($data['tr_type_id']))
			throw new App_Db_Exception_Table('Transaction type ID is not specified');

		if(empty($data['property_type_id']))
			throw new App_Db_Exception_Table('Party type ID is not specified');

		$record_data = array(
			'tr_type_id' => $data['tr_type_id'],
			'property_type_id' => $data['property_type_id'],
			'is_required' => $data['is_required'] ? 1 : 0,
			'order_in_list' => $data['order_in_list']
		);

		$where = array('tr_type_id'=>$data['tr_type_id'], 'property_type_id'=>$data['property_type_id']);
		$result = $this->db_select($this->_table, array(), $where);
		if($row = $this->db_fetch_row($result))
		{
			$this->db_update($this->_table, $record_data, $where);
		}
		else
		{
			$this->db_insert($this->_table, $record_data);
		}
		App_Cache()->refreshTags(self::CACHE_TAG);
	}


	/**
	 * Removes property type with the given ID
	 * @access public
	 * @param integer $tr_type_id    Transaction type ID
	 * @param integer $property_type_id    Party type ID
	 * @throws App_Db_Exception_Table if either transaction or property type id is not specified
	 */
	function deleteRecord($tr_type_id, $property_type_id)
	{
		if(empty($tr_type_id))
			throw new App_Db_Exception_Table('Transaction type ID is not specified');
		if(empty($property_type_id))
			throw new App_Db_Exception_Table('Party type ID is not specified');

		$this->db_delete(
			$this->_table,
			array('tr_type_id'=>$tr_type_id, 'property_type_id'=>$property_type_id)
		);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
