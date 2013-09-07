<?php
/**
 * Object properties management
 * @package aenis
 */

/**
 * Contains methods for object properties management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Relationship_Object_Properties extends App_Db_Table_Abstract
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'object_properties';


	/**
	 * Add a new property for the object
	 * @access public
	 * @param integer $object_id    Object id
	 * @param string|integer $property    Either property code or id
	 * @param string $value    Property value
	 */
	public function addProperty($object_id, $property, $value)
	{
		$oPropertyTypes = new Transaction_Property_Types();
		$property_type_info = $oPropertyTypes->getTypeInfo($property);
		$this->db_insert($this->_table,
			array(
				'object_id' => $object_id,
				'transaction_property_type_id' => $property_type_info->id,
				'value' => $property_type_info->encodeValue($value)
			)                      
		);
	}


	/**
	 * Returns value of a given property
	 * @access public
	 * @param integer $object_id    Object id
	 * @param string|integer $property    Either property code or id
	 * @return string|null    Property value or null if property cannot be found
	 */
	public function getProperty($object_id, $property)
	{
		$oPropertyTypes = new Transaction_Property_Types();
		$property_type_info = $oPropertyTypes->getTypeInfo($property);
		$result = $this->db_select(
			$this->_table,
			array('value'),
			array('object_id'=>$object_id, 'transaction_property_type_id'=>$property_type_info->id)
		);
		if($row = $this->db_fetch_row($result))
		{
			return $property_type_info->decodeValue($row[0]);
		}
		return null;
	}


	/**
	 * Returns all properties of the given object
	 * @access public
	 * @param integer $object_id    Object id
	 * @return mysqli_result
	 */
	public function getProperties($object_id)
	{
		$query = "SELECT
            	tbl.*,
            	tr_prop_types.label,
            	tr_prop_types.type
            FROM bs_{$this->_table} tbl
            LEFT JOIN bs_transaction_property_types tr_prop_types ON tr_prop_types.id = tbl.transaction_property_type_id
            WHERE tbl.object_id = '".intval($object_id)."'
        ";
		return $this->db_query($query);
	}
}
