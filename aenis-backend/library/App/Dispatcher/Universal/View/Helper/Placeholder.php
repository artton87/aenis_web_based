<?php
/**
 * Placeholder view helper definition
 * @package Framework
 */

 
/**
 * Helper for rendering files or php code parts into memory buffers, called placeholders
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_Placeholder extends App_Dispatcher_Universal_View_Helper_Abstract
{
	/**
	 * @var array    An array with placeholder contents
	 */
	protected $_placeholders = array();
	
	/**
	 * @var string    Key of current placeholder
	 */
	protected $_current = null;
	
	
	/**
	 * Helper entry point. Sets current placeholder key
	 * @access public
	 * @param string $key    Which placeholder to make current
	 * @return App_Dispatcher_Universal_View_Helper_Placeholder
	 */
	public function Placeholder($key = null)
	{
		$this->_current = $key;
		return $this;
	}
	
	
	/**
	 * Begin rendering in the current placeholder
	 * @access public
	 * @param string $key    Which placeholder to use
	 */
	public function captureStart($key)
	{
		ob_start();
	}
	
	/**
	 * End rendering in the current placeholder
	 * @access public
	 * @param string $key    Which placeholder to use
	 */
	public function captureEnd($key)
	{
		$this->_placeholders[$key] = ob_get_clean();
	}

	/**
	 * Render given partial script to the placeholder identified by key.
	 * Partial scripts should be placed under 'scripts' directory in module directory.
	 * @access public
	 * @param string $key    Which placeholder to use
	 * @param string $name    Name of script to be rendered
	 */
	public function captureScript($key, $name)
	{
		$this->captureStart($key);
		$this->_view->render($name);
		$this->captureEnd($key);
	}
	
	
	/**
	 * Returns current placeholder contents
	 * @access public
	 */
	public function __toString()
	{
		if(null === $this->_current || !array_key_exists($this->_current, $this->_placeholders))
		{
			return '';
		}
		return $this->_placeholders[$this->_current];
	}
}
