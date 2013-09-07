<?php
/**
 * PageUrl view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for getting current page url
 * @example http://www.test.com
 *          or
 *          https://www.test.com:3133/subdir/test/view
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_PageUrl extends App_Dispatcher_Universal_View_Helper_Abstract
{
	/**
	 * @var string    Constructed url stored here
	 */
	protected $_url = null;
	
	
	/**
	 * Helper entry point. 
	 * @access public
	 * @param boolean $bServerPartOnly    Optional. If true, returns server part only
	 * @return App_Dispatcher_Universal_View_Helper_PageUrl
	 */
	public function PageUrl($bServerPartOnly)
	{
		$this->_url = 'http';
		if($_SERVER['HTTPS'] == 'on')
		{
			$this->_url .= 's';
		}
		$this->_url .= '://'.$_SERVER['SERVER_NAME'];
		if($_SERVER['SERVER_PORT'] != '80')
			$this->_url .= ':'.$_SERVER['SERVER_PORT'];
		
		if(!$bServerPartOnly)
			$this->_url .= $_SERVER['REQUEST_URI'];
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
