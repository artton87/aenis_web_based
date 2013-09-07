<?php
/**
 * HeadScript view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for setting javascript includes in HTML
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_HeadScript extends App_Dispatcher_Universal_View_Helper_Abstract
{
    /**
     * Whether or not to override all contents of placeholder
     */
    const SET = 'SET';

    /**
     * Whether or not to append contents to placeholder
     */
    const APPEND = 'APPEND';

    /**
     * Whether or not to prepend contents to placeholder
     */
    const PREPEND = 'PREPEND';
    
	/**
	 * @var string    Javascripts stack
	 */
	protected $_stack = null;
	
	
	
	/**
	 * Constructor. Initializes stack
	 * @access public
	 */
	public function __construct()
	{
		$this->_stack = array();
	}
	
	
	
	/**
	 * Helper entry point.
	 * @access public
	 * @param string $script    Script to set in stack
	 * @param string $setType    Whenever to APPEND, SET or PREPEND this script in stack
	 * @return App_Dispatcher_Universal_View_Helper_HeadScript
	 */
	public function HeadScript($script = null, $setType = App_Dispatcher_Universal_View_Helper_HeadScript::APPEND)
	{
		if(!empty($script))
		{
			if(self::APPEND == $setType)
			{
				array_push($this->_stack, $script);
			}
			elseif(self::SET == $setType)
			{
				$this->_stack = array($script);
			}
			elseif(self::PREPEND == $setType)
			{
				array_unshift($this->_stack, $script);
			}
		}
		return $this;
	}
	
	
	/**
	 * Returns code, suitable for putting into HTML head
	 * @access public
	 */
	public function __toString()
	{
		$code = '';
		foreach($this->_stack as $script)
		{
			$code .= '<script type="text/javascript" language="javascript" src="'.$script.'"></script>';
		}
		return $code;
	}
}