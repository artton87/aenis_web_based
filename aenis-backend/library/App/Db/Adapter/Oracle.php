<?php
/**
 * Oracle database adapter definition
 * @package Framework\Db
 */

 
/**
 * A Oracle database connection adapter
 * @package Framework\Db
 */
class App_Db_Adapter_Oracle extends App_Db_Adapter_Abstract
{
	/**
	 * @var mixed    Connection link
	 */
	protected $_link = null;
	
	/**
	 * @var mixed    Query commit mode
	 */
	protected $_mode_autocommit = null;
	
    /**
     * @var string    Name of table from last INSERT operation
     */
    protected $_last_insert_table_name = '';
    
    /**
     * @var OCI-Lob    ROWID of newly inserted record from the last insert operation
     */
    protected $_last_insert_row_id = null;
	
	/**
	 * Quote constant for Oracle identifiers
	 */
	const IDENTIFIER_QUOTE = '';
	
	/**
	 * Quote constant for Oracle values
	 */
	const VALUE_QUOTE = "'";
	
	
	/**
	 * ORA-02292: integrity constraint (string.string) violated - child record found
	 */
	const ERROR_CODE_ROW_IS_REFERENCED = '02292';
	
	/**
	 * ORA-02291: integrity constraint (string.string) violated - parent key not found
	 */
	const ERROR_CODE_ROW_IS_REFERENCED_2 = '02291';
        
        
	/**
	 * Returns statement for frequently used DB statements
	 * @access public
	 * @param string $stmtCode    Statement code. 'NULL' or 'TIMESTAMP'
	 * @return mixed    Statement for use in db_insert, db_update, etc
	 */
	public function getStatement($stmtCode)
	{
		switch($stmtCode)
		{
			case 'NULL':
				return array('value'=>'NULL', 'escape'=>false);
			case 'TIMESTAMP':
				return array('value'=>'SYSDATE', 'escape'=>false);
			default:
				throw new App_Db_Exception_Adapter('Invalid statement code given');
		}
	}
	
	
	/**
	 * Open a new connection to the Oracle instance
	 * @access public
	 * @throws App_Db_Exception_Adapter if cannot connect
	 */
	public function connect()
	{
		$options = $this->getConnectionOptions();
		
		if(array_key_exists('charset', $options))
			$this->_link = @oci_new_connect($options['user'], $options['pass'], '//'.$options['host'].':'.$options['port'].'/'.$options['db'], $options['charset']);
		else
			$this->_link = @oci_new_connect($options['user'], $options['pass'], '//'.$options['host'].':'.$options['port'].'/'.$options['db']);
		if(FALSE !== $this->_link)
		{
			$this->autocommit(false);
			foreach($this->getConnectInitCommands() as $cmd)
			{
				$this->query($cmd);
			}
		}
		else
		{
			$e = @oci_error();
			$msg = $e ? $e['message'] : 'Unknown error during connecting to database';
			throw new App_Db_Exception_Adapter($msg);
		}
	}
	
	
	/**
	 * Returns true - if connection to database is established, false - otherwise
	 * @access public
	 * @return bool    Returns TRUE on success or FALSE on failure.
	 */
	public function isConnected()
	{
		return ($this->_link !== null);
	}
	
	
	/**
	 * Returns connection link
	 * @access public
	 * @return mixed    Connection link
	 */
	public function connection_link()
	{
		return $this->_link;
	}
	
	
	/**
	 * Returns the last error message for the most recent OCI function call that can succeed or fail.
	 * @access public
	 * @return string    A string that describes the error. An empty string if no error occurred.
	 */
	public function error()
	{
		if($this->_link)
			$e = @oci_error($this->_link);
		else
			$e = @oci_error();
		return $e ? $e['message'] : '';
	}
	
	
	/**
	 * Returns the last error code for the most recent OCI function call that can succeed or fail.
	 * @access public
	 * @return integer    An error code value for the last call, if it failed. zero means no error occurred.
	 */
	public function errno()
	{
		if($this->_link)
			$e = @oci_error($this->_link);
		else
			$e = @oci_error();
		return $e ? $e['code'] : '';
	}
	
	
	/**
	 * Returns description of connect error if there is an error during connect
	 * @access public
	 * @return string    A string that describes the error. An empty string if no error occurred.
	 */
	public function connect_check()
	{
		$e = @oci_error();
		return $e ? $e['message'] : '';
	}
	
	
	/**
	 * Performs a query against the database.
	 * @access public
	 * @param string|statement $query    Either query to execute or prepared statement
	 * @param boolean $bAddToBatch    If TRUE, adds query to batch to execute it later with multi_query. Default is FALSE.
	 * 								  Has no effect if query is a prepared statement.
	 * @return mixed    For SELECT, SHOW, DESCRIBE or EXPLAIN returns a result object. Returns NULL if $bAddToBatch=true
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function query($query, $bAddToBatch = false)
	{   
		if(is_string($query))
		{
			if($bAddToBatch)
			{
				if(null === $this->_batch_queries)
					$this->_batch_queries = array();
				$this->_batch_queries[] = $query;
				return NULL;
			}
			$stmt = oci_parse($this->_link, $query);
		}
		else
		{
			$stmt = $query;
		}
		
		if($oLogger = $this->getQueryTimeoutLogger())
		{
			$oLogger->setQuery($query);
			$oLogger->measureStart();
			$result = @oci_execute($stmt, $this->_mode_autocommit);
			$oLogger->measureEnd();
			$oLogger->logData();
		}
		else
		{
			$result = @oci_execute($stmt, $this->_mode_autocommit);
		}
		if(!$result)
		{
			$e = @oci_error($stmt);
			$msg = $e ? "Error at offset ".$e['offset'].". ".$e['message']."\nQuery is:\n".$e['sqltext'] : 'Unknown error during statement execution';
			throw new App_Db_Exception_Adapter($msg);
		}		
        return $stmt;
	}
	
	
	/**
	 * Runs queries in a batch mode. Queries are previously collected with "query" method.
	 * After running all queries, query buffer will be reset back to default state.
	 * @access public
	 * @todo Test, if multiple results are really returned
	 * @return array    Array with result resources
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function multi_query_exec()
	{
		$results = array();
		if(null !== $this->_batch_queries)
		{
			foreach($this->_batch_queries AS &$q)
			{
				$q = trim($q, ';');
				$results[] = $this->query($q);
			}
		}
		$this->_batch_queries = null;
		return $results;
	}
	
	
	/**
	 * Turns on or off auto-commiting database modifications
	 * @access public
	 * @param boolean $mode    Whether to turn on auto-commit or not.
	 */
	public function autocommit($mode)
	{
		$oci_mode = defined('OCI_NO_AUTO_COMMIT') ? OCI_NO_AUTO_COMMIT : OCI_DEFAULT;
		$this->_mode_autocommit = $mode ? OCI_COMMIT_ON_SUCCESS : $oci_mode;
	}
		
	/**
	 * Starts new transaction
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function begin_transaction()
	{
		throw new App_Db_Exception_Adapter('Method is not available for Oracle adapter');
	}
	
	
	/**
	 * Commits the current transaction for the database connection.
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function commit()
	{
		if(FALSE === @oci_commit($this->_link))
			throw new App_Db_Exception_Adapter($this->error());
	}
	
	
	/**
	 * Rollbacks the current transaction for the database.
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function rollback()
	{
		if(FALSE === @oci_rollback($this->_link))
			throw new App_Db_Exception_Adapter($this->error());
	}
	
	
	/**
	 * Fetches one row of data from the result set and returns it as an enumerated array, where
	 * each column is stored in an array offset starting from 0 (zero). Each subsequent call to
	 * this function will return the next row within the result set, or NULL if there are no more rows.
	 * @access public
	 * @param oci_result $result_id    A result set identifier
	 * @return mixed    An array of strings that corresponds to the fetched row or NULL if there are no more rows in result set.
	 */
	public function fetch_row($result_id)
	{
		$row = @oci_fetch_row($result_id);
		if(FALSE === $row)
		{
			@oci_free_statement($result_id);
		}
		return $row;
	}
	
	
	/**
	 * Fetch a result row as an associative, a numeric array, or both
	 * @access public
	 * @param oci_result $result_id    A result set identifier
	 * @param string $result_type    This optional parameter is a constant indicating what type of array should be produced from the current row data. The possible values for this parameter are the constants OCI_ASSOC, OCI_NUM, or OCI_BOTH. Defaults to OCI_ASSOC.
									 For more details about mode see http://php.net/manual/en/function.oci-fetch-array.php
	 * @param boolean $bBothCaseKeys    Optional. Defaults to true. If true - returns each field name both in uppercase and lowercode format
	 * @return mixed    An array of strings that corresponds to the fetched row or NULL if there are no more rows in resultset.
	 */
	public function fetch_array($result_id, $result_type = null, $bBothCaseKeys = true)
	{
		if(empty($result_type))
			$result_type = OCI_ASSOC + OCI_RETURN_NULLS;
        $vec = @oci_fetch_array($result_id, $result_type);
        if(FALSE === $vec)
        {
        	@oci_free_statement($result_id);
        }
        elseif($bBothCaseKeys)
        {
			$vec2 = array();
            foreach($vec as $key=>$val)
            {
                if(is_string($key))
                {
                    $vec2[strtolower($key)] = $val;
                    $vec2[strtoupper($key)] = $val;
                }
                else
                {
                    $vec2[$key] = $val;
                }
            }     
            return $vec2;
        }
        return $vec;
	}
	
	
	/**
	 * Frees resultset or statement
	 * @access public
	 * @param mixed $result   Either resultset or statement identifier
	 */
	public function free_result($result)
	{
		oci_free_statement($result);
	}
	  
	
	/**
	 * Returns the auto generated id used in the last query
	 * @access public
	 * @todo Check what will happen if user A calls insert(), then calls insert_id() to obtain ID of the row he inserted, 
	 * 		 but during the time between call to insert() and call to insert_id() user B inserts another row
     * @param string $table_name    Name of DB table
	 * @param integer $col_num    Optional. Defaults to 1. Denotes column index for PK column
	 * @return mixed    The value of the AUTO_INCREMENT field that was updated by the previous query. Returns zero if there was no previous query on the connection or if the query did not update an AUTO_INCREMENT value.
	 */
	public function insert_id($table_name='', $col_num = 1)
	{   
        if(empty($table_name))
            $table_name = $this->_last_insert_table_name;
        if(empty($table_name))
            throw new App_Db_Exception_Adapter('Table name is not specified');

        $table_name = self::IDENTIFIER_QUOTE.$this->_table_prefix.$table_name.self::IDENTIFIER_QUOTE;
        $table_name = strtoupper($table_name);
        $query = "select getfirstcol('".$table_name."', ".$col_num.") as FIRSTCOL from dual"; //  echo $query; die;
        $stid = $this->query($query);
        while($row = $this->fetch_array($stid, OCI_ASSOC))
        {
			$first_col = $row['FIRSTCOL'];
        }
        if(null !== $this->_last_insert_row_id)
        {
			$qmax = "select $first_col as MAXID from $table_name WHERE ROWID=:oracle_rowid";   // echo $qmax; die;
			$select_stmt = oci_parse($this->_link, $qmax);
			oci_bind_by_name($select_stmt, ":oracle_rowid", $this->_last_insert_row_id, -1, OCI_B_ROWID);
			$stidmax = $this->query($select_stmt);  
        }
        else
        {
			$qmax = "select max($first_col) as MAXID from $table_name";  //   echo $qmax; die;
	        $stidmax = $this->query($qmax);  
        }
        while($rowmax = $this->fetch_array($stidmax, OCI_ASSOC))
        {
			$max_row = $rowmax['MAXID'];
        }
        
       // if ($table_name == 'BS_CONTACTS')  echo "return is: ".$max_row;
      //  echo "nmax row is:".$max_row; die;
        return $max_row;

    }
	
	
	/**
	 * Gets the number of rows affected rows in a result of DML statement
	 * @access public
	 * @param oci_result $result_id    A result set identifier
	 * @return int    Number of rows in the result set.
	 */
	public function num_rows($result_id)
	{
        return oci_num_rows($result_id);
	}
    
    
    /**
     * Gets the number of rows in a result of select statement
     * @access public
     * @param string $query    Query, which row count has to be determined
     * @return int    Number of rows in the result set.
     */
    public function num_selected_rows($query)
    {   //echo "hereeeeeeeeeeeeee"; die;
		$q = "select max(rownum) AS c from ($query)";
        $resid = $this->query($q);
        $cnt_rows=0;
        while($row = $this->fetch_array($resid))
        {
            $cnt_rows = $row['c'];
        }
        return $cnt_rows;
    }
	
	
	/**
	 * Creates a legal SQL string that can be used in an SQL statement
	 * @access public
	 * @param string $s    The string to be escaped
	 * @return string    An escaped string
	 */
	public function escape_string($s)
	{
        if(!$this->isConnected())
			throw new App_Db_Exception_Adapter("\nDatabase link is empty.");
			
		if(get_magic_quotes_gpc())
		{
			$s = stripslashes($s);
		}
		return str_replace("'", "''", $s);
	}
	
	
	/**
	 * Closes a previously opened database connection.
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function close()
	{
		if(FALSE === @oci_close($this->_link))
			throw new App_Db_Exception_Adapter($this->error());
		$this->_link = null;
	}
	
	
	/**
	 * Insert new record
	 * @access public
	 * @param string $table    Table name
	 * @param array $fields    Associative array with "field name" => "field value" pairs.
	 * 						   Field values can be arrays as in _prepare_field_value() function.
	 * @param boolean $bReturnSQLParts    Optional. If true, does not run query, but returns SQL parts for INSERT statement
	 * 									  in form of associative array with 'columns', 'values' keys
	 * @see _prepare_field_value
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function insert($table, $fields, $bReturnSQLParts=false)
    {
        $this->_last_insert_table_name = $table;
        if(null !== $this->_last_insert_row_id)
        {
			$this->_last_insert_row_id->free();
			$this->_last_insert_row_id = null;
        }
        
		$field_names = array_keys($fields);
		foreach($field_names as &$field_name)
		{
			$field_name = self::IDENTIFIER_QUOTE.$field_name.self::IDENTIFIER_QUOTE;	
		}
		$field_names = implode(',', $field_names);
		
		$field_values = array_values($fields);
		foreach($field_values as &$field_value)
		{
			$field_value = $this->_prepare_value($field_value, self::VALUE_QUOTE);
		}
		
		$field_values = implode(',', $field_values);	
		
		if($bReturnSQLParts)
			return array('columns'=>"($field_names)", 'values'=>"($field_values)");
		
		$table = self::IDENTIFIER_QUOTE.$this->_table_prefix.$table.self::IDENTIFIER_QUOTE;
        
		$q = "INSERT INTO $table ($field_names) VALUES ($field_values)\nRETURNING ROWID INTO :oracle_rowid";
		
        //echo $q; die;
        
		$ins_stid = oci_parse($this->_link, $q);
		$this->_last_insert_row_id = oci_new_descriptor($this->_link, OCI_D_ROWID);
		oci_bind_by_name($ins_stid, ":oracle_rowid", $this->_last_insert_row_id, -1, OCI_B_ROWID);
		$this->query($ins_stid);
		oci_free_statement($ins_stid);
		return true;
	}
	
	
	/**
	 * Update existing record
	 * @access public
	 * @param string $table    Table name
	 * @param array $fields    Associative array with "field name" => "field value" pairs.
	 * 						   Field values can be arrays as in _prepare_field_value() function.
	 * @param array $where    Associative array with "field name" => "field value" pairs used for WHERE condition.
	 * 						  Field values can be arrays as in _prepare_field_value() function.
	 * @see _prepare_field_value
	 * @see _sql_where
	 * @throws App_Db_Exception_Adapter on failure
	 * @return boolean
	 */
	public function update($table, $fields, $where)
	{
		 $table = self::IDENTIFIER_QUOTE.$this->_table_prefix.$table.self::IDENTIFIER_QUOTE;
		
		$values = array();
		foreach($fields as $field_name=>$field_value)
		{
			$values[] = self::IDENTIFIER_QUOTE.$field_name.self::IDENTIFIER_QUOTE.'='.$this->_prepare_value($field_value, self::VALUE_QUOTE);
		}
		if(empty($values)) return true;
		$values = implode(',', $values);
		
		$where = $this->_sql_where($where);
		
		$q = "UPDATE $table SET $values $where";
        return $this->query($q);
	}
	
	
	/**
	 * Selects records from database table
	 * @access public
	 * @param string $table    Table name
	 * @param array $fields    Array with field names. If empty, all fields will be selected
	 * @param array $where    Optional. Associative array with "field name" => "field value" pairs used for WHERE condition.
	 * 						  Field values can be arrays as in _prepare_field_value() function.
	 * @param array $order    Optional. Array with field names by which result should be sorted
	 * @param integer $count    A count for LIMIT clause
	 * @param integer $offset    An offset for LIMIT clause
	 * @see _prepare_field_value
	 * @see _sql_where
	 * @throws App_Db_Exception_Adapter on failure
	 * @return resource
	 */
	public function select($table, array $fields, $where = array(), array $order = array(), $count = null, $offset = null)
	{
		 $table = self::IDENTIFIER_QUOTE.$this->_table_prefix.$table.self::IDENTIFIER_QUOTE;
        	
		$sql_fields = '*';
		$select_fields = array();
		foreach($fields as $key=>$value)
		{
			if(is_numeric($key))
			{
				$select_fields[] = $value;
			}
			else
			{
				$select_fields[] = $this->_sql_quote_identifier($key).' AS '.self::IDENTIFIER_QUOTE.$value.self::IDENTIFIER_QUOTE;
			}
		}
		if(0<count($select_fields))
			$sql_fields = implode(',', $select_fields); 
		
		$sql_order = '';
		$order_fields = array();
		foreach($order as $key=>$value)
		{
			if(is_numeric($key))
			{
				$order_fields[] = $this->_sql_quote_identifier($value);
			}
			else
			{
				$dir = strtoupper($value);
				if(!in_array($dir, array('ASC','DESC'))) $dir = 'ASC';
				$order_fields[] = $this->_sql_quote_identifier($key).' '.$dir;
			}
		}
		if(0<count($order_fields))
			$sql_order = 'ORDER BY '.implode(',', $order_fields);
		
		// LIMIT clause
		if(null !== $count && null === $offset)
		{
			$where[] = 'ROWNUM<='.intval($count);
		}
		else //null === $count || null !== $offset
		{
			$limit_condition = array();
			if(null !== $offset)
			{
				$limit_condition[] = 'RN >= '.$offset;
				
				if(null !== $count)
				{
					$limit_condition[] = 'RN <= '.($offset+$count);
				}
			}
			$limit_condition = empty($limit_condition) ? '' : implode(' AND ', $limit_condition);
			
		}
		// LIMIT clause - ends
		
		$where = $this->_sql_where($where);
		
		if(empty($limit_condition))
		{
			$q = "SELECT $sql_fields FROM $table $where $sql_order";
		}
		else
		{
			$q = "SELECT * FROM (	
					SELECT $sql_fields, ROWNUM as RN FROM $table $where
				)
				WHERE $limit_condition
				$sql_order
			";
		}
        return $this->query($q);
	}
	
    
    
    
	/**
	 * Delete existing record
	 * @access public
	 * @param string $table    Table name
	 * @param array $where    Optional. Associative array with "field name" => "field value" pairs used for WHERE condition.
	 * 						  Field values can be arrays as in _prepare_field_value() function.
	 * @see _prepare_field_value
	 * @see _sql_where
	 * @throws App_Db_Exception_RowIsReferenced if there are referenced rows, and given row cannot be deleted because of that,
	 * @return boolean    Returns TRUE on success or FALSE on failure
	 */
	public function delete($table, $where = array())
	{
		 $table = self::IDENTIFIER_QUOTE.$this->_table_prefix.$table.self::IDENTIFIER_QUOTE;
		
		$where = $this->_sql_where($where);
		
		try {
			$q = "DELETE FROM $table $where";
			$result = $this->query($q);
		}
		catch(App_Db_Exception_Adapter $e)
		{
			$error_code = $this->errno();
			if(self::ERROR_CODE_ROW_IS_REFERENCED_2 === $error_code || self::ERROR_CODE_ROW_IS_REFERENCED === $error_code)
			{
				throw new App_Db_Exception_RowIsReferenced($this->error(), $error_code);
			}
			else throw $e;
		}
		return $result;
	}
	
	
	/**
	 * Escapes given value and prepares it for inserting into SQL statement.
	 *    If $value is array, $value['value'] is field value, optional 'escape' key is used to control value escaping.
	 *    If $value['escape']==false, value will not be escaped. In any other case values will be always escaped.
	 *    Example: to set field value to current date, pass array('value'=>'CURDATE()', 'escape'=>false) as $value
	 * @access protected
	 * @param string|array $value    Value to be escaped. 
	 * @param string $quoteString    String to be used as quote
	 * @return string    An escaped field value
	 */
	protected function _prepare_value($value, $quoteString)
	{
		$bEscape = true;
		if(is_array($value))
		{
			if(array_key_exists('escape', $value) && false === $value['escape']) $bEscape=false;
			$value = $value['value'];
		}
		
		if(true === $bEscape)
		{
			$value = $this->escape_string($value);
			if(!is_numeric($value) || $value!==(string)(floatval($value)))
				$value = $quoteString . $value . $quoteString;
		}
		
		return $value;
	}
	
	
	/**
	 * Constructs WHERE condition
	 * Example:
	 * <code>
	 * <?php
	 *   // Here first condition is "field name" => "field value" pair.
	 *   // Second condition is database expression.
	 *   // Third condition is "field name" => "field value" pair, where "field value" is not escaped.
	 *   $where = array(
	 *     'language_id' => 1,
	 *     "IS_NULL('status')",
	 *     'date' => array('value'=>'MONTH(CUR_DATE())', 'escape'=>false)
	 *   );
	 * ?>
	 * </code>
	 * 
	 * @access protected
	 * @param array $where    Associative array with "field name" => "field value" pairs used for WHERE condition.
	 * 						  Field values can be arrays as in _prepare_field_value() function.
	 * 						  If "field_name" is numeric, "field_value" will be treated as database expression
	 * @see _prepare_field_value
	 * @return string    WHERE part of SQL query
	 */
	protected function _sql_where($where)
	{
		$conditions = array();
		foreach($where as $key=>$value)
		{
			if(is_numeric($key))
			{
				$conditions[] = $value;
			}
			else
			{
				$conditions[] = $this->_sql_quote_identifier($key).'='.$this->_prepare_value($value, self::VALUE_QUOTE);
			}
		}
		return (0<count($conditions)) ? 'WHERE '.implode(' AND ', $conditions) : '';
	}
	
	
	/**
	 * Quotes given sql identifier
	 * @access protected
	 * @param string $s    An sql identifier
	 */
	protected function _sql_quote_identifier($s)
	{
		if($this->_is_sql_identifier($s))
			$s = self::IDENTIFIER_QUOTE.$s.self::IDENTIFIER_QUOTE;
		return $s;
	}
    
        
    /**
     * Calls PL/SQL stored procedure
     * @access public
     * @param string $proc_name    Procedure name
     * @param array $proc_args    Associative array wof ('procedure_argument_name' => 'argument_value') pairs, containing IN arguments of procedure
     */
    public function call_proc($proc_name, $proc_args)
    {
        $p_keys = array();
        $p_vals = array();
        foreach($proc_args as $k => $v)
        {
            $p_keys[] = ':'.$k;
            $p_vals[] = $v;
        }
        $proc_query = "BEGIN $proc_name(".implode(',', $p_keys)."); END;";
        $stid_p = ociparse($this->_link, $proc_query);  
        for ($i=0; $i<count($proc_args); $i++)
        {
            oci_bind_by_name($stid_p,"$p_keys[$i]",$p_vals[$i],32);
        }
        if(!oci_execute($stid_p))
        	throw new App_Db_Exception_Table('wrong procedure call');
        oci_free_statement($stid_p);
    } 
    
    
}
