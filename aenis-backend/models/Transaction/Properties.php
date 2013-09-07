<?php
/**
 * Transaction properties management
 * @package aenis
 */

/**
 * Contains methods for transaction properties management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Properties extends App_Db_Table_Abstract
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'transaction_properties';


	/**
	 * Add a new property for the transaction
	 * @access public
	 * @param integer $transaction_id    Transaction id
	 * @param string|integer $property    Either property code or id
	 * @param string $value    Property value
	 */
	public function addProperty($transaction_id, $property, $value)
	{
		$oPropertyTypes = new Transaction_Property_Types();
		$property_type_info = $oPropertyTypes->getTypeInfo($property);
		$this->db_insert($this->_table,
			array(
				'tr_id' => $transaction_id,
				'transaction_property_type_id' => $property_type_info->id,
				'value' => $property_type_info->encodeValue($value)
			)
		);
	}


	/**
	 * Returns value of a given property
	 * @access public
	 * @param integer $transaction_id    Transaction id
	 * @param string|integer $property    Either property code or id
	 * @return mixed|null    Property value or null if property cannot be found
	 */
	public function getProperty($transaction_id, $property)
	{
		$oPropertyTypes = new Transaction_Property_Types();
		$property_type_info = $oPropertyTypes->getTypeInfo($property);
		$result = $this->db_select(
			$this->_table,
			array('value'),
			array('tr_id'=>$transaction_id, 'transaction_property_type_id'=>$property_type_info->id)
		);
		if($row = $this->db_fetch_row($result))
		{
			return $property_type_info->decodeValue($row[0]);
		}
		return null;
	}


	/**
	 * Returns all properties of the given transaction
	 * @access public
	 * @param integer $transaction_id    Transaction id
	 * @return mysqli_result
	 */
	public function getProperties($transaction_id)
	{
		$query = "SELECT
            	tbl.*,
            	tr_prop_types.label,
            	tr_prop_types.type
            FROM bs_{$this->_table} tbl
            LEFT JOIN bs_transaction_property_types tr_prop_types ON tr_prop_types.id = tbl.transaction_property_type_id
            WHERE tbl.tr_id = '".intval($transaction_id)."'
        ";
		return $this->db_query($query);
	}
}
