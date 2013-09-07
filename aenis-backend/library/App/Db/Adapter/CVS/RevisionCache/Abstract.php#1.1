<?php
/**
 * Abstract database adapter definition
 * @package Framework\Db
 */
 
 
/**
 * A parent class for all database connection adapters
 * @package Framework\Db
 */
abstract class App_Db_Adapter_Abstract
{
	/**
	 * @var array    Associative array with connection options, including host, port, user, pass, db
	 */
	protected $_connection_options = null;
	
	/**
	 * @var array    Array with connect init commands
	 */
	protected $_connect_init_commands = array();
	
	/**
	 * @var string    Prefix for all database tables
	 */
	protected $_table_prefix = '';
	
	/**
	 * @var array    Array with queries to execute at once using with multi_query_exec
	 */
	protected $_batch_queries = null;
	
	/**
	 * @var array    Holds timeout logger
	 */
	private $_timeout_logger = null;

	
	/**
	 * Set database connection options
	 * @access public
	 * @param mixed $host    Can be either a host name or an IP address
	 * @param mixed $user    The database user name
	 * @param mixed $pass    The database user password
	 * @param mixed $db    If provided will specify the default database to be used when performing queries
     * @param mixed $port    Specifies the port number to attempt to connect to the database server
	 * @param string $charset    Optional. Specifies the connection charset
	 */
	public function setConnectionOptions($host, $user, $pass, $db, $port, $charset = 'UTF8')
	{
		$this->_connection_options['host'] = $host;
		$this->_connection_options['user'] = $user;
		$this->_connection_options['pass'] = $pass;
		$this->_connection_options['db'] = $db;
        $this->_connection_options['port'] = $port;
		$this->_connection_options['charset'] = $charset;
	}
	
	
	/**
	 * Returns array with connection options
	 * @access public 
	 * @return array    Associative array with connection options
	 */
	public function getConnectionOptions()
	{
		return $this->_connection_options;
	}
	
	
	/**
	 * Appends one or more initialization commands
	 * @access public
	 * @param string|array $init_command    Array with init commands or a single init command to be executed after establishing connection to DB server
	 * @param boolean $bPrepend    Optional. Whenever to make newly added command first in the list
	 */
	public function addConnectInitCommand($init_command, $bPrepend = false)
	{
		if(is_string($init_command))
			$init_command = array($init_command);
		foreach($init_command as $command)
		{
			if($bPrepend)
				array_unshift($this->_connect_init_commands, $command);
			else
				array_push($this->_connect_init_commands, $command);
		}
	}
	
	
	/**
	 * Returns array with initialization commands
	 * @access public 
	 * @return array    Array with initialization commands
	 */
	public function getConnectInitCommands()
	{
		return $this->_connect_init_commands;
	}
	
	
	/**
	 * Removes all initialization commands
	 * @access public
	 */
	public function resetConnectInitCommands()
	{
		$this->_connect_init_commands = array();
	}
	
	
	/**
	 * Sets a prefix for all database tables
	 * @access public
	 * @param string $prefix    Prefix value
	 */
	public function setTablePrefix($prefix)
	{
		$this->_table_prefix = $prefix;
	}
	
	
	/**
	 * Returns a prefix for all database tables
	 * @access public
	 * @return string    Prefix value
	 */
	public function getTablePrefix()
	{
		return $this->_table_prefix;
	}
	
	
	/**
	 * Open a new connection to the database server
	 * @abstract
	 * @access public
	 * @return bool    Returns TRUE on success or FALSE on failure.
	 */
	abstract public function connect();
	
	/**
	 * Returns true - if connection to database is established, false - otherwise
	 * @abstract
	 * @access public
	 * @return bool    Returns TRUE on success or FALSE on failure.
	 */
	abstract public function isConnected();
	
	/**
	 * Closes a previously opened database connection.
	 * @abstract
	 * @access public
	 * @return boolean    Returns TRUE on success or FALSE on failure.
	 */
	abstract public function close();
	
	/**
	 * Returns statement for frequently used DB statements
	 * @access public
	 * @param string $stmtCode    Statement code. 'NULL' or 'TIMESTAMP'
	 * @return mixed    Statement for use in db_insert, db_update, etc
	 */
	abstract public function getStatement($stmtCode);
	
	
	/**
	 * Returns TRUE, if given string is a valid sql identifier, FALSE - otherwise
	 * @access protected
	 * @param string $name    SQL identfier to be checked
	 * @return boolean
	 */
	protected function _is_sql_identifier($name)
	{
		$nMatches = preg_match('/^[a-zA-Z_]+[a-zA-Z_0-9]*$/', $name);
		return (0 == $nMatches) ? FALSE : TRUE;
	}
	
	
	/**
	 * Enables or disables timeout logging features
	 * @access protected
	 * @param App_Db_QueryTimeoutLogger $loggerObject    A logger object
	 */
	public final function setQueryTimeoutLogger($loggerObject)
	{
		$this->_timeout_logger = $loggerObject;
	}
	
	
	/**
	 * Returns timeout logger object
	 * @access protected
	 * @return App_Db_QueryTimeoutLogger    A logger object
	 */
	public final function getQueryTimeoutLogger()
	{
		return $this->_timeout_logger;
	}
}