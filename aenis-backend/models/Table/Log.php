<?php
/**
 * Logging into database tables
 * @package Core\Logging
 */

/**
 * Table log handling methods
 * @author BestSoft
 * @package Core\Logging
 */
class Table_Log extends App_Db_Table_Abstract
{
	/**
	 * Types for table log
	 */
	const LOG_DB_ACTION_UPDATED = 1;
	const LOG_DB_ACTION_INSERTED = 2;
	const LOG_DB_ACTION_DELETED = 3;
	
	
	/**
     * Creates new entry in a table log.
     * After that items can be added to that entry using log_new_entry method
     * @access public
     * @see Table_Log::log_insert_item()
     * @param string $table_name   Table name, where action occured
     * @param integer $record_id    Record id, with which action occured
     * @param integer $action    One of LOG_DB_ACTION_XXX constants
     * @return integer    ID of log entry
     */
	public function log_insert($table_name, $record_id, $action)
	{
		if(empty($action)) $action = self::LOG_DB_ACTION_INSERTED;
		
		$user_id = App_Registry::get('temp_sn')->user_id;
		if(empty($user_id))
			$user_id = self::$DB_NULL;
		
		$this->db_insert(
			'table_log',
			array(
	            'table_name' => $table_name,
	            'record_id' => $record_id,
	            'action_taken' => $action,
	            'lu_user_ip' => getenv('REMOTE_ADDR'),
	            'lu_user_id' => $user_id,
	            'lu_date' => self::$DB_TIMESTAMP
	        )
        );
        
        return $this->db_insert_id();
	}
	
	
	/**
     * Files a new item under given table log entry.
     * @access public
     * @param integer $table_log_id    ID of table_log entry
     * @param string $field_name   Field name, with which action occured
     * @param string $old_value    Old value of that field
     * @param string $new_value    New value of that field
     * @param boolean $bReturnSQLParts    Optional. If true, does not run query, but returns SQL parts for INSERT statement
	 * 									  in form of associative array with 'columns', 'values' keys
	 * @throws App_Exception if table log id is not specified
     * @return integer    ID of log entry item
     */
	public function log_insert_item($table_log_id, $field_name, $old_value, $new_value, $bReturnSQLParts=false)
	{
		if(empty($table_log_id))
			throw new App_Exception('Parameter table_log_id cannot be empty. Call log_insert first to obtain it.');
        
		$id = $this->db_insert(
			'table_log_items',
			array(
		        'table_log_id' => $table_log_id,
		        'field_name' => $field_name,
		        'old_value' => (null===$old_value) ? self::$DB_NULL : $old_value,
		        'new_value' => (null===$new_value) ? self::$DB_NULL : $new_value
		    ),
		    $bReturnSQLParts
	    );
		if($bReturnSQLParts)
			return $id; //'id' is array, containing SQL parts as received from db_insert method of adapter
        
        return $this->db_insert_id();
	}
	
	
	/**
     * Inserts non-zero fields into table log.
     * @access public
     * @param string $table_name    Table name, where action occurred
     * @param integer $record_id     Record id, with which action occurred
     * @param array $update_array    An associative array with new values
     * @return integer    ID of log entry
     */
	public static function insert_added($table_name, $record_id, &$update_array)
	{       
		$oLog = new Table_Log();
		$log_id = $oLog->log_insert($table_name, $record_id, self::LOG_DB_ACTION_INSERTED);
		$values = array();
		$columns = null;
		foreach($update_array as $field_name=>$new_value)
		{
			if(null===$new_value || $new_value===self::$DB_NULL) continue;
			$v = $oLog->log_insert_item($log_id, $field_name, null, $new_value, true);
			$values[] = $v['values'];
			if(null===$columns)
				$columns = $v['columns'];
		}
		$oLog->exec_table_log_items_multiinsert_query($columns, $values);
		return $log_id;
	}
	
	
	/**
     * Compares record fields returned by given query with given update array values and inserts difference into table log.
     * @access public
     * @param string $table_name    Table name, where action occurred
     * @param integer $record_id     Record id, with which action occurred
     * @param string|mysqli_result|resource $query    A select query for getting old values from database or mysql result
     * @param array $update_array    An associative array with new values
     * @return array    An associative array with old row values
     */
    public static function insert_modified($table_name, $record_id, $query, &$update_array)
    {
    	$oLog = new Table_Log();
        if(is_string($query))
            $old_result = $oLog->db_query($query);
        else
            $old_result = $query;
        if($old_array = $oLog->db_fetch_array($old_result))
        {
			$table_log_id = $oLog->log_insert($table_name, $record_id, self::LOG_DB_ACTION_UPDATED);
	        if(!empty($table_log_id))
	        {
	        	$values = array();
				$columns = null;
	            foreach($update_array as $field_name => $field_value) 
	            {
	            	if(self::$DB_NULL === $field_value) $field_value = '';
	                if($old_array[$field_name]!=$field_value)        
	                {
						$v = $oLog->log_insert_item($table_log_id, $field_name, $old_array[$field_name], $field_value, true);
	                    $values[] = $v['values'];
						if(null===$columns)
							$columns = $v['columns'];
	                }
	            }
				$oLog->exec_table_log_items_multiinsert_query($columns, $values);
	        }
        }
        return $old_array;
    }
    
    
    /**
     * Save fields of record, which is subject to deletion, into table log
     * @access public
     * @param string $table_name    Table name
     * @param integer $record_id    Id, used for finding record
     * @param string $record_id_field_name    Name of field, which holds that id
     * @return integer    ID of log entry
     */
    public static function insert_deleted($table_name, $record_id, $record_id_field_name)
    {
    	$oLog = new Table_Log();
    	$table_log_id = null;
    	$result = $oLog->db_select($table_name, array(), array($record_id_field_name=>$record_id));
    	while($old_array = $oLog->db_fetch_array($result))
    	{
			$table_log_id = $oLog->log_insert($table_name, $record_id, self::LOG_DB_ACTION_DELETED);
			if(!empty($table_log_id))
			{
				$values = array();
				$columns = null;
				foreach($old_array as $field_name => $field_value) 
		        {        
        			$v = $oLog->log_insert_item($table_log_id, $field_name, $field_value, self::$DB_NULL, true);
        			$values[] = $v['values'];
					if(null===$columns)
						$columns = $v['columns'];
		        }
		        $oLog->exec_table_log_items_multiinsert_query($columns, $values);
			}
		}
		return $table_log_id;
    }
    
    
    /**
     * Inserts multiple items into 'table_log_items' at once
     * @access protected
     * @param array|null $columns    Array with 'table_log_items' columns
     * @param array $values    Array with table field values
     */
    protected function exec_table_log_items_multiinsert_query($columns, $values)
    {
		if(count($values)>0)
		{
			$values = implode(',', $values);
			$tbl_prefix = $this->getAdapter()->getTablePrefix();
			$this->db_query("INSERT INTO {$tbl_prefix}table_log_items $columns VALUES $values");
		}
    }
}
