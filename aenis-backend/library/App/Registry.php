<?php
/**
 * Global variables storage implementation
 * @package Framework\Registry
 */

 
/**
 * Provides convenient way for working with global variables.
 * Registry is a global shared storage, which can be accessed everytime, from everywhere in boundaries of php execution session.
 * @package Framework\Registry
 */
class App_Registry
{
	/**
	 * @static
	 * @var array    Application registry
	 */
	protected static $_registry = array();
	

	/**
	 * Set value of registry key
	 * @static
	 * @access public
	 * @param mixed $key    Registry key
	 * @param mixed $value    Registry value
	 */
	public static function set($key, $value)
	{
		self::$_registry[$key] = $value;
	}
	
	
	/**
	 * Returns value of registry key
	 * @static
	 * @access public
	 * @param mixed $key    Registry key
	 * @return mixed    The value of registry key, or null
	 */
	public static function get($key)
	{
		if(array_key_exists($key, self::$_registry))
		{
			return self::$_registry[$key];
		}
		return null;
	}
}