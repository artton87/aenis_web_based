<?php
/**
 * Logging class definition
 * @package aenis\library
 */

/**
 * A class for logging exceptions and arbitrary debug information
 * @author BestSoft
 * @package aenis\library
 */
class Logger
{
	/**
	 * Name of exception log file
	 * @access protected
	 * @static
	 * @var string
	 */
	protected static $exception_log_file = null;
	
	/**
	 * Name of debug log file
	 * @access protected
	 * @static
	 * @var string
	 */
	protected static $debug_log_file = null;


	/**
	 * Sets exception log path
	 * @access public
	 * @static
	 * @param string $path    Path to exception log
	 * @throws App_Exception if given path is not writable
	 */
	public static function setExceptionLogPath($path)
	{
		if(!file_exists($path) OR !is_writable($path))
			throw new App_Exception("Given exception log path ($path) is not writable.");
		self::$exception_log_file = $path;
	}

	/**
	 * Sets debug log path
	 * @access public
	 * @static
	 * @param string $path    Path to debug log
	 * @throws App_Exception if given path is not writable
	 */
	public static function setDebugLogPath($path)
	{
		if(!file_exists($path) OR !is_writable($path))
			throw new App_Exception("Given exception log path ($path) is not writable.");
		self::$debug_log_file = $path;
	}


	/**
	 * Returns exception log path
	 * @access public
	 * @static
	 * @return string    Path to debug log
	 */
	public static function getExceptionLogPath()
	{
		return self::$exception_log_file;
	}


	/**
	 * Returns debug log path
	 * @access public
	 * @static
	 * @return string    Path to debug log
	 */
	public static function getDebugLogPath()
	{
		return self::$debug_log_file;
	}

	
	/**
	 * Logs exception into file.
	 * If exception log path is not configured (see setExceptionLogPath), will log into error_log.
	 * @static
	 * @access public
	 * @param Exception $e    An Exception object
	 */
	public function logException($e)
	{
		$trace = $e->getTraceAsString();
		$message = 'A) Timestamp: '.date('d/m/Y H:i:s').'   Client IP: '.getenv('REMOTE_ADDR').PHP_EOL.
			'B) Message'.PHP_EOL.$e->getMessage().PHP_EOL.
			'C) Stack trace'.PHP_EOL.$trace.PHP_EOL.
			PHP_EOL.PHP_EOL;
		if(null === self::$exception_log_file)
		{
			error_log($message, 0);
		}
		else
		{
			$handle = fopen(self::$exception_log_file, 'a');
			fwrite($handle, $message);
			fclose($handle);
		}
	}
	
	
	/**
	 * Logs given string into debug log. Useful for debugging purposes.
	 * If debug log path is not configured (see setDebugLogPath), will log into error_log.
	 * @access public
	 * @param mixed $data    Data to dump to log file
	 */
	public static function logDebugInformation($data)
	{
		$message = (is_string($data) ? $data : print_r($data,1)).PHP_EOL;
		if(null === self::$debug_log_file)
		{
			error_log($message, 0);
		}
		else
		{
			$handle = fopen(self::$debug_log_file, 'a');
			fwrite($handle, $message);
			fclose($handle);
		}
	}


	/**
	 * Echoes print_r result enclosed in <pre> tags and dies.
	 * @param mixed $variable    Variable to output
	 * @param boolean $not_die    Optional. If given, will not die.
	 */
	public static function out($variable, $not_die=false)
	{
		echo '<pre>'.PHP_EOL;
		print_r($variable);
		echo PHP_EOL.'</pre>';
		if(!$not_die) die;
	}


	/**
	 * Echoes var_dump result enclosed in <pre> tags and dies.
	 * @param mixed $variable    Variable to output
	 * @param boolean $not_die    Optional. If given, will not die.
	 */
	public static function dump($variable, $not_die=false)
	{
		echo '<pre>'.PHP_EOL;
		var_dump($variable);
		echo PHP_EOL.'</pre>';
		if(!$not_die) die;
	}
}
