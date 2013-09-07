<?php
/**
 * Cache management
 * @package Framework\Cache
 */

 
/**
 * A singleton for working with cache.
 * @package Framework\Cache
 */
class App_Cache
{
	/**
	 * A single instance of this class
	 * @var App_Cache
	 */
	protected static $_instance = null;


	/**
	 * @var App_Cache_Adapter_Abstract   An adapter used for caching items
	 */
	protected $_adapter = null;


	/**
	 * Protected constructor for singleton pattern implementation
	 */
	protected function __construct() {}


	/**
	 * Returns an instance of this class
	 * @access public
	 * @static
	 * @return App_Cache
	 */
	public static function instance()
	{
		if(self::$_instance)
			return self::$_instance;

		/**
		 * Shorthand syntax for App_Cache::instance()->getAdapter()
		 * @return App_Cache_Adapter_Abstract
		 */
		function App_Cache() {
			return App_Cache::instance()->getAdapter();
		}

		self::$_instance = new self();
		return self::$_instance;
	}


	
	/**
	 * Sets caching adapter
	 * @access public
	 * @param App_Cache_Adapter_Abstract $adapter    An instance of App_Db_Adapter_Abstract
	 */
	public function setAdapter($adapter)
	{
		$this->_adapter = $adapter;
	}
	
	
	/**
	 * Returns caching adapter
	 * @access public
	 * @return App_Cache_Adapter_Abstract    An instance of App_Db_Adapter_Abstract
	 */
	public function getAdapter()
	{
		return $this->_adapter;
	}
}
