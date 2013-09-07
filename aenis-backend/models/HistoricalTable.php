<?php
/**
 * Common functionality for tables which support history
 * @package aenis
 */

/**
 * Common functionality for tables which support history
 * @author BestSoft
 * @package aenis
 */
class HistoricalTable extends App_Db_Table_Abstract
{
	/**
	 * Table name as in database
	 * @var string
	 */
	protected $_table = '';


    /**
	 * Inserts new record, using adjacency list model with
	 * 'new_id', 'first_id', 'lu_user_id', 'lu_date' fields.
	 * @param array $data     Associative array database table field values
	 * @return integer    ID of newly inserted record
	 */
	public function insertUsingAdjacencyListModel($data)
	{
		$common_data = array(
			'lu_user_id' => App_Registry::get('temp_sn')->user_id,
			'lu_date' => self::$DB_TIMESTAMP
		);

		$this->db_insert($this->_table, $common_data+$data);
		$new_id = $this->db_insert_id();
		$this->db_update($this->_table, array('first_id'=>$new_id), array('id'=>$new_id));
		return $new_id;
	}


    /**
	 * Updates an existing record, using adjacency list model with
	 * 'new_id', 'first_id', 'lu_user_id', 'lu_date' fields.
	 * @param integer $id    ID of record to be updated
	 * @param array $data     Associative array database table field values
	 * @throws App_Db_Exception_Table if it is impossible to obtain first_id for the given record
	 * @return integer    ID of newly inserted record
	 */
	public function updateUsingAdjacencyListModel($id, $data)
	{
		$common_data = array(
			'lu_user_id' => App_Registry::get('temp_sn')->user_id,
			'lu_date' => self::$DB_TIMESTAMP
		);

		$result = $this->db_select($this->_table, array('first_id'), array('id'=>$id));
		if($row = $this->db_fetch_row($result))
		{
			$common_data['first_id'] = $row[0];
		}

		if(empty($common_data['first_id']))
			throw new App_Db_Exception_Table("Unable to get first_id for record #$id");

		$this->db_insert($this->_table, $common_data+$data);
		$new_id = $this->db_insert_id();
		$this->db_update($this->_table, array('new_id'=>$new_id), array('id'=>$id));
		return $new_id;
	}


	/**
	 * Returns actual record
	 * @access public
	 * @param array $where    An array with search criteria
	 * @return array|null    Array with fields, null - if record cannot be found
	 */
	public function getActualUsingAdjacencyListModel($where)
	{
		$conditions = $where + array('del_user_id IS NULL', 'new_id IS NULL');
		$result = $this->db_select($this->_table, array(), $conditions);
		if($row = $this->db_fetch_array($result))
		{
			return $row;
		}
		return null;
	}
}
