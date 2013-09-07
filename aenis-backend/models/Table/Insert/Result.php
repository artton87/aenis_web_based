<?php
/**
 * Database insert result standardization
 * @package aenis
 */

/**
 * Describes result type which database insert methods should return
 * @author BestSoft
 * @package aenis\core
 */
class Table_Insert_Result
{
	/**
	 * Id of newly inserted record (id from 'foo' table)
	 * @var integer
	 */
	public $id = 0;

	/**
	 * Id of newly inserted data record (id from 'foo_dt' table)
	 * @var integer
	 */
	public $dt_id = 0;


	/**
	 * Constructor. Sets values for class properties
	 * @param integer $id    Id of newly inserted record (id from 'foo' table)
	 * @param integer $dt_id    Id of newly inserted data record (id from 'foo_dt' table)
	 */
	public function __construct($id, $dt_id)
	{
		$this->id = (int)$id;
		$this->dt_id = (int)$dt_id;
	}
}
