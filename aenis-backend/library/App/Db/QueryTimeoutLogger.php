<?php
/**
 * Timeout events logging for database adapters 
 * @package Framework\Db
 */
 
 
/**
 * A class for logging query timeout events
 * @package Framework\Db
 */
class App_Db_QueryTimeoutLogger
{
	/**
	 * @var integer    Octal constant for permissions of created folders
	 * @access private
	 */
	private $_permissions = 0775;
	
	/**
	 * @var string    Where to store slow query logs
	 * @access private
	 */
	private $_logging_path = '';
	
	/**
	 * @var string    Query start time
	 * @access private
	 */
	private $_query_start_time = 0;
	
	/**
	 * @var string    Query end time
	 * @access private
	 */
	private $_query_end_time = 0;
	
	/**
	 * @var string    Query which is measured
	 * @access private
	 */
	private $_query = '';
	
	/**
	 * @var string    Timeout value
	 * @access private
	 */
	private $_timeout_time = 0;

	
	/**
	 * Constructor
	 * @access public
	 */
	public function __construct()
	{
		srand(time());
	}
	
	
	/**
	 * Logs data. Implementation of App_Logger_Interface::logData()
	 * @access public
	 */
	public function logData()
	{
		$query_time = $this->_query_end_time - $this->_query_start_time;
		if($this->_timeout_time == 0 OR ($query_time < $this->_timeout_time))
		{
			return;
		}
		$formatted_time = sprintf(
			"%d minutes, %d seconds and %d milliseconds", 
			(int) ($query_time / 60), (int) ($query_time), (int) ($query_time * 1000) - ((int) ($query_time)) * 1000
		);
		$time_prefix = sprintf("%09.4fsec", $query_time);
		$data = '$_SESSION = '.print_r($_SESSION,1).PHP_EOL.PHP_EOL;
		$data .= '$_POST = '.print_r($_POST,1).PHP_EOL.PHP_EOL;
		$data .= '$_GET = '.print_r($_GET,1).PHP_EOL.PHP_EOL;
		$e = new Exception;
		$data .= 'Stack trace: '.PHP_EOL.$e->getTraceAsString().PHP_EOL.PHP_EOL;
		$data .= 'Query has run in '.$formatted_time.' time'.PHP_EOL.PHP_EOL;
		$data .= '======== QUERY ========'.PHP_EOL.$this->_query.PHP_EOL;
		
		$file_name = $time_prefix.'_'.mktime().'.'.sprintf("%3d",rand(0,999)).'.log';
		$file_path = $this->_logging_path . '/' . date('d-m-Y') . '/';
		
		@mkdir($file_path, $this->_permissions, true);
		$handle = fopen($file_path.$file_name, 'wb');
		fwrite($handle, $data);
		fclose($handle);
	}
	
	
	/**
	 * Sets logging directory
	 * @access public
	 * @param string $logging_path    A directory, where log files which be put
	 */
	public function setLoggingPath($logging_path)
	{
		rtrim($logging_path, '/\\');
		$this->_logging_path = $logging_path . '/';
	}
	
	/**
	 * Sets query running time
	 * @access public
	 * @param float $time    Query time
	 */
	public function setQueryTime($time)
	{
		$this->_query_time = $time;
	}
	
	/**
	 * Sets query
	 * @access public
	 * @param string $query    Query
	 */
	public function setQuery($query)
	{
		$this->_query = $query;
	}
	
	/**
	 * Sets query timeout time
	 * @access public
	 * @param string $timeout_time    Timeout value in microseconds
	 */
	public function setTimoutTime($timeout_time)
	{
		$this->_timeout_time = $timeout_time;
	}
	
	/**
	 * Gets query timeout time
	 * @access public
	 * @return string    Timeout value in microseconds
	 */
	public function getTimoutTime()
	{
		return $this->_timeout_time;
	}
	
	
	/**
	 * Starts time measurement
	 * @access public
	 */
	public function measureStart()
	{
		$this->_query_start_time = microtime(true);
	}
	
	
	/**
	 * End time measurement
	 * @access protected
	 */
	public function measureEnd()
	{
		$this->_query_end_time = microtime(true);
	}
}