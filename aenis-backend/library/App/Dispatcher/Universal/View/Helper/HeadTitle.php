<?php
/**
 * HeadTitle view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for setting and retrieving title element for HTML head
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_HeadTitle extends App_Dispatcher_Universal_View_Helper_Abstract
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
	 * @var string    Head title stack
	 */
	protected $_stack = null;
	
	/**
	 * @var string    Head title separator
	 */
	protected $_separator = null;
	
	
	
	/**
	 * Constructor. Sets default separator and initializes stack
	 * @access public
	 */
	public function __construct()
	{
		$this->_stack = array();
		$this->setSeparator();
	}
	
	
	/**
	 * Sets separator used for separating title strings
	 * @access public
	 * @param string $sep    New separator value
	 */
	public function setSeparator($sep = ' - ')
	{
		$this->_separator = $sep;
	}
	
	
	/**
	 * Returns separator used for separating title strings
	 * @access public
	 * @return string    New separator value
	 */
	public function getSeparator()
	{
		return $this->_separator;
	}
	
	
	/**
	 * Helper entry point.
	 * @access public
	 * @param string $title    Title to set in title stack
	 * @param string $setType    Whenever to APPEND, SET or PREPEND this title in stack
	 * @return App_Dispatcher_Universal_View_Helper_HeadTitle
	 */
	public function HeadTitle($title = null, $setType = App_Dispatcher_Universal_View_Helper_HeadTitle::APPEND)
	{
		if(!empty($title))
		{
			if(self::APPEND == $setType)
			{
				array_push($this->_stack, $title);
			}
			elseif(self::SET == $setType)
			{
				$this->_stack = array($title);
			}
			elseif(self::PREPEND == $setType)
			{
				array_unshift($this->_stack, $title);
			}
		}
		return $this;
	}
	
	
	/**
	 * Returns title, suitable for putting into HTML head
	 * @access public
	 */
	public function __toString()
	{
		return implode($this->_separator, $this->_stack);
	}
}