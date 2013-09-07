<?php
/**
 * Abstract controller definition for universal dispatcher
 * @package Framework\Dispatcher
 */

 
/**
 * A parent class for all controllers for universal dispatcher
 * @package Framework\Dispatcher
 * @abstract
 */
abstract class App_Dispatcher_Universal_Controller_Abstract
{
	/**
	 * @var App_Dispatcher_Universal    Dispatcher object 
	 */
	protected $_dispatcher = null;
	
	
	/**
	 * @var App_Dispatcher_Universal_View    View object to render scripts
	 */
	protected $_view = null;
	
	
	
	/**
	 * Returns view object of this controller
	 * @access public
	 * @return App_Dispatcher_Universal_View
	 */
	public function getView()
	{
		return $this->_view;
	}
	
	
	/**
	 * Sets view object of this controller. Normally this method is called only by dispatcher
	 * @access public
	 * @param $view App_Dispatcher_Universal_View    View object
	 */
	public function setView($view)
	{
		$this->_view = $view;
	}
	
	
	/**
	 * Callback function, called by dispatcher before any action method
	 * Controller classes can override it, to do something before controller's action execution
	 * @access public
	 */
	public function beforeActionCallback()
	{
	}
	
	
	/**
	 * Sets dispatcher for this controller 
	 * @access public
	 * @param App_Dispatcher_Universal $oDispatcher    A dispatcher object
	 */
	public function setDispatcher($oDispatcher)
	{
		$this->_dispatcher = $oDispatcher;
		
		//by default disable view script rendering for xml_http_requests
		if($this->_dispatcher->getRequest()->isAjaxRequest())
		{
			$this->_dispatcher->enableView(false);
		}
	}
}