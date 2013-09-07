<?php
/**
 * Universal dispatcher view definition
 * @package Framework\Dispatcher
 */

 
/**
 * View class of universal dispatcher
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View
{
	/**
	 * @var App_Dispatcher_Universal    Dispatcher object 
	 */
	protected $_dispatcher = null;
	
	/**
	 * @var string    Path to scripts directory, under which view scripts and partials are stored
	 */
	protected $_script_directory = '/';
	
	/**
	 * @var array    An array with layout helpers
	 */
	protected static $_helpers = array();
	
	
	/**
	 * Constructor. Registers predefined helpers.
	 * Other helpers can be registered from everywhere and before calling them.
	 * @access public
	 */
	public function __construct()
	{
		self::registerHelper('App_Dispatcher_Universal_View_Helper_Placeholder');
		self::registerHelper('App_Dispatcher_Universal_View_Helper_Url');
		self::registerHelper('App_Dispatcher_Universal_View_Helper_PageUrl');
		self::registerHelper('App_Dispatcher_Universal_View_Helper_FileUrl');
		self::registerHelper('App_Dispatcher_Universal_View_Helper_HeadTitle');
	    self::registerHelper('App_Dispatcher_Universal_View_Helper_HeadScript');
		self::registerHelper('App_Dispatcher_Universal_View_Helper_HeadLinkStylesheet');
		self::registerHelper('App_Dispatcher_Universal_View_Helper_HeadMeta');
		self::registerHelper('App_Dispatcher_Universal_View_Helper_FileSizeDisplay');
	}
	
	
	
	/**
	 * Appends helper to layout helper stack. Helper instance will be created only at first call to that helper
	 * @access public
	 * @param string $helper_class_name    Helper class name
	 */
	public static function registerHelper($helper_class_name)
	{
		self::$_helpers[$helper_class_name] = array(
			'instance' => null,
			'name' => App_Dispatcher_Universal_View_Helper_Abstract::getNameFromClassName($helper_class_name)
		);
	}
	
	/**
	 * Removes helper from layout helper stack
	 * @access public
	 * @param string $helper_class_name    Name of helper
	 */
	public static function unregisterHelper($helper_class_name)
	{
		if(array_key_exists($helper_class_name, self::$_helpers))
		{
			unset(self::$_helpers[$helper_class_name]);
		}
	}
	
	
	
	/**
	 * Sets dispatcher object for this view
	 * @access public
	 * @param App_Dispatcher_Universal $oDispatcher    A dispatcher object
	 */
	public function setDispatcher($oDispatcher)
	{
		$this->_dispatcher = $oDispatcher;
		$this->_script_directory = $oDispatcher->getRoute()->getModulesPath().$oDispatcher->getRoute()->getModule().'/views/';
	}
	
	/**
	 * Returns dispatcher object for this view
	 * @access public
	 * @return App_Dispatcher_Universal    A dispatcher object
	 */
	public function getDispatcher()
	{
		return $this->_dispatcher;
	}
	
	
	/**
	 * Returns path to scripts directory, under which view scripts and partials are stored
	 * @access public
	 * @return string    Path to script directory
	 */
	public function getScriptDirectory()
	{
		return $this->_script_directory;
	}
	
	/**
	 * Returns App_Request object, holding current request parameters
	 * @access public
	 * @return App_Request    An App_Request object
	 */
	public function getRequest()
	{
		return $this->_dispatcher->getRequest();
	}
	
	
	/**
	 * Renders given script
	 * @access public
	 * @param string $script    Path to script file
	 */
	public function render($script)
	{
		$script = $this->_script_directory.$script;
		if(!file_exists($script) || !is_readable($script))
			throw new App_Exception('Script '.$script.' cannot be found');
		include($script);
	}
	
	
	/**
	 * Returns helper object by given helper name
	 * @access public
	 * @param string $helperName    Name of helper. This is not class name as in registerHelper.
	 * @see App_Dispatcher_Universal_View_Helper_Abstract::getNameFromClassName
	 */
	public function getHelper($helperName)
	{
		foreach(self::$_helpers as $helper_class_name=>$info)
		{
			if($info['name'] == $helperName)
			{
				if(null === $info['instance'])
				{
					$oHelper = new $helper_class_name();
					$oHelper->setView($this);
					self::$_helpers[$helper_class_name]['instance'] = $oHelper;
				}
				return self::$_helpers[$helper_class_name]['instance'];
			}
		}
		return null;
	}
	
	
	/**
	 * Enables magic methods
	 * 
	 * To call helpers use following syntax:
	 * <code>
	 * $this->helper<HelperName>(...) //calls helper named HelperName
	 * $this->helperUrl(...) //calls Url helper
	 * </code>
	 * 
	 * To call translate() method of attached translator, use:
	 * <code>
	 * $this->translate() //can be used instead of $this->_dispatcher->getTranslator()->translate()
	 * </code>
	 * 
	 * @access public
	 * @param string $name    Function name
	 * @param array $args    Function arguments
	 * @return mixed    Function return result
	 */
	public function __call($name, $args)
	{
		if(0===strpos($name, 'helper'))
		{
			$helperName = substr($name, strlen('helper'));
			$oHelper = $this->getHelper($helperName);
			if(null === $oHelper) return null;
			$obj = array($oHelper, $helperName);
		}
		else
		{
			$obj = ($name=='translate') ? array($this->_dispatcher->getTranslator(), 'translate') : array(self, $name);
		}
		
		if(!is_callable($obj, false, $callableName))
		{
			throw new App_Exception('Method '.$name.' has not been found!');
		}
		return call_user_func_array($obj, $args);
	}
}