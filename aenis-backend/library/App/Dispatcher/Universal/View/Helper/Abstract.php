<?php
/**
 * Abstract view helper definition for universal dispatcher
 * @package Framework\Dispatcher
 */

 
/**
 * A parent class for all view helpers of universal dispatcher
 * @package Framework\Dispatcher
 * @abstract
 */
abstract class App_Dispatcher_Universal_View_Helper_Abstract
{
	/**
	 * @var App_Dispatcher_Universal_View    A view object
	 */
	protected $_view = null;
	

	/**
	 * Sets a view object of dispatcher
	 * @access public
	 * @param App_Dispatcher_Universal_View $oView    A view object
	 */
	public function setView($oView)
	{
		$this->_view = $oView;
	}
	
	
	/**
	 * Returns helper name
	 * @access public
	 * @return string    Helper name
	 */
	public function getName()
	{
		$name = get_class($this);
		return self::getNameFromClassName($name);
	}
	
	
	/**
	 * Returns helper name by class name
	 * @access public
	 * @param string $class_name    Helper class name
	 * @return string    Helper name
	 */
	public static function getNameFromClassName($class_name)
	{
		$pos = strrpos($class_name, '_');
		if(FALSE !== $pos)
		{
			return substr($class_name, $pos+1);
		}
		return $class_name;
	}
	
	
	/**
	 * Return string representation of helper
	 * @return string
	 */
	public function toString()
	{
		return $this->__toString();
	}
}