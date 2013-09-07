<?php
/**
 * MySQL database adapter definition
 * @package Framework\Db
 */

 
/**
 * A MySQL database connection adapter
 * @package Framework\Db
 */
class App_Db_Adapter_Mysql extends App_Db_Adapter_Abstract
{
	/**
	 * @var mixed    Connection link
	 */
	protected $_link = null;
	
	
	/**
	 * Quote constant for MySQL identifiers
	 */
	const IDENTIFIER_QUOTE = '`';
	
	/**
	 * Quote constant for MySQL values
	 */
	const VALUE_QUOTE = "'";
	
	
	/**
	 * MySQL Error: 1217. SQLSTATE: 23000 (ER_ROW_IS_REFERENCED)
	 */
	const ERROR_CODE_ROW_IS_REFERENCED = 1217;
	
	/**
	 * MySQL Error: 1451. SQLSTATE: 23000 (ER_ROW_IS_REFERENCED_2)
	 */
	const ERROR_CODE_ROW_IS_REFERENCED_2 = 1451;
	
	
	
	/**
	 * Returns statement for frequently used DB statements
	 * @access public
	 * @param string $stmtCode    Statement code. 'NULL' or 'TIMESTAMP'
	 * @throws App_Db_Exception_Adapter if statement code is passed
	 * @return mixed    Statement for use in db_insert, db_update, etc
	 */
	public function getStatement($stmtCode)
	{
		switch($stmtCode)
		{
			case 'NULL':
				return array('value'=>'NULL', 'escape'=>false);
			case 'TIMESTAMP':
				return array('value'=>'CURRENT_TIMESTAMP()', 'escape'=>false);
			default:
				throw new App_Db_Exception_Adapter('Invalid statement code given');
		}
	}
	
	
	/**
	 * Open a new connection to the MySQL server
	 * @access public
	 * @param array $init_commands    Optional. Array with init commands to be executed after establishing connection to MySQL server
	 * @throws App_Db_Exception_Adapter if cannot connect
	 * @return bool    Returns TRUE on success or FALSE on failure.
	 */
	public function connect($init_commands = array())
	{
		$options = $this->getConnectionOptions();
		
		$this->_link = @mysqli_init();
		if(!$this->_link)
			throw new App_Db_Exception_Adapter('Cannot initialize MySQLi!');
		
		if(array_key_exists('charset', $options))
			$this->addConnectInitCommand("SET NAMES '{$options['charset']}'", true);
		
		foreach($this->getConnectInitCommands() as $cmd)
		{
			if(!@mysqli_options($this->_link, MYSQLI_INIT_COMMAND, $cmd))
				throw new App_Db_Exception_Adapter("Cannot set init command $cmd!");
		}
		
		if(!@mysqli_options($this->_link, MYSQLI_INIT_COMMAND, 'SET AUTOCOMMIT=0'))
			throw new App_Db_Exception_Adapter('Cannot set init command #1!');
		
		if(@mysqli_real_connect($this->_link, $options['host'], $options['user'], $options['pass'], $options['db'], $options['port']))
		{
			$this->begin_transaction();
		}
		else throw new App_Db_Exception_Adapter(mysqli_connect_error());
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
	 * Returns the last error message for the most recent MySQLi function call that can succeed or fail.
	 * @access public
	 * @return string    A string that describes the error. An empty string if no error occurred.
	 */
	public function error()
	{
		return mysqli_error($this->_link);
	}
	
	
	/**
	 * Returns the last error code for the most recent MySQLi function call that can succeed or fail.
	 * @access public
	 * @return integer    An error code value for the last call, if it failed. zero means no error occurred.
	 */
	public function errno()
	{
		if($this->_link)
			return @mysqli_errno($this->_link);
		return null;
	}
	
	
	/**
	 * Returns description of connect error if there is an error during connect
	 * @access public
	 * @return string    A string that describes the error. An empty string if no error occurred.
	 */
	public function connect_check()
	{
		if(mysqli_connect_errno())
			return mysqli_connect_error();
		return '';
	}
	
	
	/**
	 * Performs a query against the database.
	 * @access public
	 * @param string $query
	 * @param boolean $bAddToBatch    If TRUE, adds query to batch to execute it later with multi_query. Default is FALSE.
	 * @return mixed    For SELECT, SHOW, DESCRIBE or EXPLAIN returns a result object. Returns NULL if $bAddToBatch=true
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function query($query, $bAddToBatch = false)
	{
		if($bAddToBatch)
		{
			if(null === $this->_batch_queries)
				$this->_batch_queries = array();
			$this->_batch_queries[] = $query;
			return NULL;
		}
		
		if($oLogger = $this->getQueryTimeoutLogger())
		{
			$oLogger->setQuery($query);
			$oLogger->measureStart();
			$result = @mysqli_query($this->_link, $query);
			$oLogger->measureEnd();
			$oLogger->logData();
		}
		else
		{
			$result = @mysqli_query($this->_link, $query);
		}
		if(FALSE === $result)
		{
			throw new App_Db_Exception_Adapter($this->error()."\nQuery is:\n".$query);
		}
		return $result;
	}
	
	
	/**
	 * Runs queries in a batch mode. Queries are previously collected with "query" method.
	 * After running all queries, query buffer will be reset back to default state.
	 * @access public
	 * @return array    Array with mysqlresult resources
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function multi_query_exec()
	{
		$results = array();
		if(null !== $this->_batch_queries)
		{
			foreach($this->_batch_queries AS &$q)
				$q = trim($q, ';');
			$q = implode(';', $this->_batch_queries);
			if(FALSE === @mysqli_multi_query($this->_link, $q))
			{
				throw new App_Db_Exception_Adapter($this->error()."\nFirst query from batch mode is:\n".$this->_batch_queries[0]);
			}
			else
			{
				do {
					$result = mysqli_store_result($this->_link);
					if(FALSE === $result && 0!=@mysqli_errno($this->_link))
					{
						throw new App_Db_Exception_Adapter($this->error());
					}
					$results[] = $result;
				}
				while(mysqli_more_results($this->_link) && mysqli_next_result($this->_link));
			}
		}
		$this->_batch_queries = null;
		return $results;
	}
	
	
	/**
	 * Turns on or off auto-commiting database modifications
	 * @access public
	 * @param boolean $mode    Whether to turn on auto-commit or not.
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function autocommit($mode)
	{
		if(FALSE === @mysqli_autocommit($this->_link, $mode))
			throw new App_Db_Exception_Adapter($this->error());
	}
		
	/**
	 * Starts new transaction
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function begin_transaction()
	{
		$this->query('START TRANSACTION');
	}
	
	
	/**
	 * Commits the current transaction for the database connection.
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function commit()
	{
		if(FALSE === @mysqli_commit($this->_link))
			throw new App_Db_Exception_Adapter($this->error());
	}
	
	
	/**
	 * Rollbacks the current transaction for the database.
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function rollback()
	{
		if(FALSE === @mysqli_rollback($this->_link))
			throw new App_Db_Exception_Adapter($this->error());
	}
	
	
	/**
	 * Fetches one row of data from the result set and returns it as an enumerated array, where
	 * each column is stored in an array offset starting from 0 (zero). Each subsequent call to
	 * this function will return the next row within the result set, or NULL if there are no more rows.
	 * @access public
	 * @param mysqli_result $result_id    A result set identifier
	 * @return mixed    An array of strings that corresponds to the fetched row or NULL if there are no more rows in result set.
	 */
	public function fetch_row($result_id)
	{
		return @mysqli_fetch_row($result_id);
	}
	
	
	/**
	 * Fetch a result row as an associative, a numeric array, or both
	 * @access public
	 * @param mysqli_result $result_id    A result set identifier
	 * @param integer $result_type    This optional parameter is a constant indicating what type of array should be produced from the current row data. The possible values for this parameter are the constants MYSQLI_ASSOC, MYSQLI_NUM, or MYSQLI_BOTH. Defaults to MYSQLI_ASSOC.
	 * @return mixed    An array of strings that corresponds to the fetched row or NULL if there are no more rows in resultset.
	 */
	public function fetch_array($result_id, $result_type = MYSQLI_ASSOC)
	{
		return @mysqli_fetch_array($result_id, $result_type);
	}
	
	
	/**
	 * Frees result set or statement
	 * @access public
	 * @todo Implement for statement
	 * @param mixed $result   Either result set or statement identifier
	 */
	public function free_result($result)
	{
		@mysqli_free_result($result);
	}
	
	
	/**
	 * Returns the auto generated id used in the last query
	 * @access public
	 * @return mixed    The value of the AUTO_INCREMENT field that was updated by the previous query. Returns zero if there was no previous query on the connection or if the query did not update an AUTO_INCREMENT value.
	 */
	public function insert_id()
	{
		return @mysqli_insert_id($this->_link);
	}
	
	
	/**
	 * Gets the number of rows in a result
	 * @access public
	 * @param mysqli_result $result_id    A result set identifier
	 * @return int    Number of rows in the result set.
	 */
	public function num_rows($result_id)
	{
		return @mysqli_num_rows($result_id);
	}
	
	
	/**
	 * Creates a legal SQL string that can be used in an SQL statement
	 * @access public
	 * @param string $s    The string to be escaped
	 * @throws App_Db_Exception_Adapter if there is no connection to DB
	 * @return string    An escaped string
	 */
	public function escape_string($s)
	{
		if(!$this->isConnected())
			throw new App_Db_Exception_Adapter("\nDatabase link is empty.");
		return @mysqli_real_escape_string($this->_link, $s);
	}
	
	
	/**
	 * Closes a previously opened database connection.
	 * @access public
	 * @throws App_Db_Exception_Adapter on failure
	 */
	public function close()
	{
		if(FALSE === @mysqli_close($this->_link))
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
	 * @return array|boolean    If $bReturnSQLParts=true, returns array, otherwise - boolean
	 */
	public function insert($table, $fields, $bReturnSQLParts=false)
	{
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
		$q = "INSERT INTO $table ($field_names) VALUES ($field_values)";
		return $this->query($q);
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
	 * @return mysqli_result
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
		
		$where = $this->_sql_where($where);
		
		// LIMIT clause
		$limit = '';
		if(null !== $count)
		{
			$limit = intval($count);
		}
		if(null !== $offset)
		{
			if('' === $limit)
				throw new App_Db_Exception_Adapter('An offset without count is specified for LIMIT clause.');
			$limit = intval($offset).','.$limit;
		}
		if('' !== $limit)
		{
			$limit = 'LIMIT '.$limit;
		}
		// LIMIT clause - ends
		
		$q = "SELECT $sql_fields FROM $table $where $sql_order $limit";
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
	 * @throws App_Db_Exception_RowIsReferenced if there are referenced rows, and given row cannot be deleted because of that
	 * @throws App_Db_Exception_Adapter on db errors
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
			$value = $quoteString . $this->escape_string($value) . $quoteString;
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
	 * @return string
	 */
	protected function _sql_quote_identifier($s)
	{
		if($this->_is_sql_identifier($s))
			$s = self::IDENTIFIER_QUOTE.$s.self::IDENTIFIER_QUOTE;
		return $s;
	}
}
