<?php
/**
 * Parent class for all exceptions
 * @package Framework\Exception
 */

 
/**
 * Parent class for all application exceptions
 * @package Framework\Exception
 */
class App_Exception extends Exception
{
	/**
	 * Installs error handler, which will turn all PHP errors to App_Exceptions.
	 * Note, that error_reporting setting is considered, that is, by changing error reporting
	 * level one can disable triggering of errors of specific types.
	 */
	public static function setupErrorHandler()
	{
		set_error_handler(array(get_class(), 'errorHandler'));
	}


	/**
	 * Returns list of function names, listed as disabled via 'disable_functions' setting in php.ini
	 * @access public
	 * @static
	 * @return array
	 */
	public static function getPHPDisabledFunctions()
	{
		$disabled_functions = ini_get('disable_functions');
		$disabled_functions = explode(',', $disabled_functions);
		foreach($disabled_functions as &$fn)
		{
			$fn = trim($fn);
		}
		return $disabled_functions;
	}


	/**
	 * PHP error handling routine
	 * @access public
	 * @param integer $errorLevel    The level of the error raised
	 * @param string $message    Error message
	 * @param string $file    Filename that the error was raised in
	 * @param integer $line    Line number the error was raised at
	 * @throws App_Exception
	 */
	public static function errorHandler($errorLevel, $message, $file, $line)
	{
		// This error code is not included in error_reporting
		if(!(error_reporting() & $errorLevel)) return;

		//throw an exception
		throw new self($message);
	}
}
