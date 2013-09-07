<?php
/**
 * HeadLinkStylesheet view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for setting stylesheet includes in HTML
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_HeadLinkStylesheet extends App_Dispatcher_Universal_View_Helper_Abstract
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
	 * @param string $src    Stylesheet to set in stack
	 * @param string $setType    Whenever to APPEND, SET or PREPEND this stylesheet in stack
	 * @return App_Dispatcher_Universal_View_Helper_HeadLinkStylesheet
	 */
	public function HeadLinkStylesheet($src = null, $setType = App_Dispatcher_Universal_View_Helper_HeadLinkStylesheet::APPEND)
	{
		if(!empty($src))
		{
			if(self::APPEND == $setType)
			{
				array_push($this->_stack, $src);
			}
			elseif(self::SET == $setType)
			{
				$this->_stack = array($src);
			}
			elseif(self::PREPEND == $setType)
			{
				array_unshift($this->_stack, $src);
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
		foreach($this->_stack as $src)
		{
			$code .= '<link rel="stylesheet" type="text/css" href="'.$src.'"/>';
		}
		return $code;
	}
}