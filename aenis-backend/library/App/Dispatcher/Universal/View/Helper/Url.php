<?php
/**
 * Url view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for constructing universal dispatcher urls
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_Url extends App_Dispatcher_Universal_View_Helper_Abstract
{
	/**
	 * @var string    Constructed url stored here
	 */
	protected $_url = null;
	
	
	/**
	 * Helper entry point. Calls App_Dispatcher_Route::assemble if array given, prepends baseUrl if string is given.
	 * @access public
	 * @param string|array $params    Array with 'module', 'lang', 'controller', 'action', 'params', 'reset' keys.
	 * 						   		  Each value of this array corresponds to parameter of urlRoute function.
	 * @return App_Dispatcher_Universal_View_Helper_Url
	 */
	public function Url($params)
	{
		$oRoute = $this->_view->getDispatcher()->getRoute();
		if(is_array($params))
			$this->_url = $oRoute->getBaseUrl().$oRoute->assemble($params['module'], $params['lang'], $params['controller'], $params['action'], $params['params'], $params['reset']);
		else
			$this->_url = $oRoute->getBaseUrl().ltrim($params, '/');
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