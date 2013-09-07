<?php
/**
 * Transaction property type
 * @package aenis
 */

/**
 * Information about single transaction property type
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Property_Type_Info
{
	/**
	 * Id as in database
	 * @var integer
	 */
	public $id = 0;

	/**
	 * Property type code
	 * @var string
	 */
	public $code = null;

	/**
	 * Property type group.
	 * Can be 'transaction', 'subject' or 'object'.
	 * @var string
	 */
	public $code_group = null;

	/**
	 * Type of value.
	 * Can be 'string', 'date', 'boolean', 'number', 'enum', 'object'
	 * @var string
	 */
	public $type = null;


	/**
	 * Sets initial values.
	 * @param string $type    Property type. The only required parameter.
	 * @param integer $id    Optional. Property type id.
	 * @param string $code    Optional. Property type code.
	 * @param string $code_group    Optional. Property type code group.
	 *
	 */
	public function __construct($type, $id = 0, $code = null, $code_group = null)
	{
		$this->type = $type;
		$this->id = $id;
		$this->code = $code;
		$this->code_group = $code_group;
	}


	/**
	 * Returns value, prepared for storing into database
	 * @see decodeValue
	 * @access public
	 * @param mixed $value
	 * @return int|string
	 */
	public function encodeValue($value)
	{
		if($this->type == 'object')
		{
			return serialize($value);
		}
		elseif($this->type == 'boolean')
		{
			return $value ? 1 : 0;
		}
		return $value;
	}


	/**
	 * Returns value, decoded after reading from database
	 * @see encodeValue
	 * @access public
	 * @param mixed $value
	 * @return mixed
	 */
	public function decodeValue($value)
	{
		if($this->type == 'object')
		{
			return unserialize($value);
		}
		elseif($this->type == 'boolean')
		{
			return !empty($value);
		}
		return $value;
	}
}
