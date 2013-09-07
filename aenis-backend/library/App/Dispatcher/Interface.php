<?php
/**
 * Dispatcher interface definition
 * @package Framework\Dispatcher
 */

 
/**
 * Interface, which all dispatchers should implement
 * @package Framework\Dispatcher
 */
interface App_Dispatcher_Interface
{
	/**
	 * Dispatches current url request
	 * @access public
	 */
	public function dispatch();
}