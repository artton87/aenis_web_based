<?php
/**
 * HeadMeta view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for setting meta tag includes in HTML
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_HeadMeta extends App_Dispatcher_Universal_View_Helper_Abstract
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
	 * @param string $name    Meta name
	 * @param string $content    Meta content
	 * @param string $http_equiv    Meta 'http-equiv' attribute
	 * @param string $setType    Whenever to APPEND, SET or PREPEND this stylesheet in stack
	 * @return App_Dispatcher_Universal_View_Helper_HeadMeta
	 */
	public function HeadMeta($name = null, $content = null, $http_equiv = null, $setType = App_Dispatcher_Universal_View_Helper_HeadMeta::APPEND)
	{
		if(!empty($name) or !empty($content) or !empty($http_equiv))
		{
			if(self::APPEND == $setType)
			{
				array_push($this->_stack, array('name'=>$name, 'content'=>$content, 'http-equiv'=>$http_equiv));
			}
			elseif(self::SET == $setType)
			{
				$this->_stack = array(array('name'=>$name, 'content'=>$content, 'http-equiv'=>$http_equiv));
			}
			elseif(self::PREPEND == $setType)
			{
				array_unshift($this->_stack, array('name'=>$name, 'content'=>$content, 'http-equiv'=>$http_equiv));
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
		foreach($this->_stack as $meta)
		{
			$code .= '<meta';
			if(!empty($meta['name']))
				$code .= ' name="'.$meta['name'].'"';
			if(!empty($meta['content']))
				$code .= ' content="'.$meta['content'].'"';
			if(!empty($meta['http-equiv']))
				$code .= ' http-equiv="'.$meta['http-equiv'].'"';
			$code .= '/>';
		}
		return $code;
	}
}
