<?php
/**
 * FileUrl view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for constructing universal dispatcher urls which point to uploaded files in storage
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_FileUrl extends App_Dispatcher_Universal_View_Helper_Abstract
{
	/**
	 * @var string    Constructed url stored here
	 */
	protected $_url = null;
	
	/**
	 * @static
	 * @var string    Path to file storage location, relative to baseUrl
	 */
	protected static $_storage_path = null;
	
	
	
	/**
     * Sets path to file storage location
     * @static
     * @access public
     * @param string $path    Path to file storage location, relative to baseUrl
     */
	public static function setStoragePath($path)
	{
		$path = rtrim($path, '/\\');
		self::$_storage_path= $path.'/';
	}
	
	/**
     * Returns path to file storage location, relative to baseUrl
     * @static
     * @access public
     * @return array
     */
	public static function getStoragePath()
	{
		return self::$_storage_path;
	}
	
	
	/**
	 * Helper entry point. Returns url, which links to uploaded file in storage
	 * @access public
	 * @param string $params    Array with 'path', 'name' keys.
	 * @return App_Dispatcher_Universal_View_Helper_FileUrl
	 */
	public function FileUrl($params)
	{
		$path = rtrim($params['path'], '/\\');
		$name = $params['name'];
		
		$oRoute = $this->_view->getDispatcher()->getRoute();
		$this->_url = $oRoute->getBaseUrl().ltrim(self::$_storage_path.$path.'/'.$name, '/');
		return $this;
	}
	
	
	/**
	 * Returns constructed url
	 * @access public
	 */
	public function __toString()
	{
		return $this->_url;
	}
}
