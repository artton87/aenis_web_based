<?php
/**
 * Route definition for universal dispatcher
 * @package Framework\Route
 */

 
/**
 * Router for universal dispatcher, which parses urls in module/language/controller/action format
 * @package Framework\Route
 */
class App_Route_Universal
{
	/**
	 * @var string    Name of index controller
	 */
	protected $_index_controller = null;
	
	/**
	 * @var string    Name of index action
	 */
	protected $_index_action = null;
	
	/**
	 * @var string    Name of error controller
	 */
	protected $_error_controller = null;
	
	/**
	 * @var string    Name of error action
	 */
	protected $_error_action = null;
	
	/**
	 * @var string    Path to application modules directory
	 */
	protected $_module_path = null;

	/**
	 * @var array    Application modules
	 */
	protected $_available_modules = null;
	
	/**
	 * @var array    An array with all available translation languages
	 */
	protected $_available_languages = null;
	
	/**
	 * @var array    An array with all available shorthand notations
	 */
	protected $_shorthand_notations = array();
	
	
	/**
	 * @var string    Everything in url after hostname and before module/lang/controller/action part
	 */
	protected $_baseUrl = null;
	
	/**
	 * @var string    Module name
	 */
	protected $_module = null;
	
	/**
	 * @var string    Language identifier
	 */
	protected $_language = null;
	
	/**
	 * @var string    Controller name
	 */
	protected $_controller = null;
	
	/**
	 * @var string    Action name
	 */
	protected $_action = null;
	
	/**
	 * @var array    Url params
	 */
	protected $_url_params = array();
	
	
	/**
	 * Class constructor
	 * @access public
	 * @param string $modulesPath    Path to modules directory
	 * @param array $languages    An array with language identifiers
	 */
	public function __construct($modulesPath = null, $languages = null)
	{
		if(null!==$modulesPath)
			$this->setModulesPath($modulesPath);
		if(null!==$languages)
			$this->setLanguages($languages);
		$this->setErrorController();
		$this->setErrorAction();
		$this->setIndexController();
		$this->setIndexAction();
	}
	
	
	
	/**
	 * Set module path
	 * @access public
	 * @param string $path    Path to modules directory
	 */
	public function setModulesPath($path)
	{
		$path = rtrim($path, '/\\');
		$this->_module_path = $path.'/';
		
		$this->_available_modules = array();
		if($handle = opendir($this->_module_path))
		{
			while(false !== ($file = readdir($handle)))
			{
				if($file == '.' || $file == '..') continue;
				if(is_dir($this->_module_path.'/'.$file))
				{
					$this->_available_modules[$file] = 0;
				}
			}
		}
	}
	
	/**
	 * Returns module path
	 * @access public
	 * @return string    Path to modules directory
	 */
	public function getModulesPath()
	{
		return $this->_module_path;
	}
	
	/**
	 * Set default module name
	 * @access public
	 * @param string $name    Optional module name. Default name is 'default'
	 */
	public function setDefaultModule($name = 'default')
	{
		foreach($this->_available_modules as $module=>&$isDefault)
		{
			$isDefault = ($module==$name) ? 1 : 0;
		}
	}
	
	/**
	 * Returns default module name
	 * @access public
	 * @return string    Name of default module
	 */
	public function getDefaultModule()
	{
		foreach($this->_available_modules as $module=>$isDefault)
		{
			if(1==$isDefault) return $module;
		}
		return null;
	}
	
	
	
	/**
	 * Sets languages array
	 * @access public
	 * @param array $languages    An array with language identifiers
	 */
	public function setLanguages(array $languages)
	{
		$this->_available_languages = array();
		foreach($languages as $lang)
			$this->_available_languages[$lang] = 0;
	}
	
	/**
	 * Set default languages name
	 * @access public
	 * @param string $name    Language name
	 */
	public function setDefaultLanguage($name)
	{
		foreach($this->_available_languages as $lang=>&$isDefault)
		{
			$isDefault = ($lang==$name) ? 1 : 0;
		}
	}
	
	/**
	 * Returns default language identifier
	 * @access public
	 * @return string    Identifier of default language
	 */
	public function getDefaultLanguage()
	{
		foreach($this->_available_languages as $lang=>$isDefault)
		{
			if(1==$isDefault) return $lang;
		}
		return null;
	}
	
	
	/**
	 * Sets name of index controller
	 * @access public
	 * @param string $name    Name of index controller
	 */
	public function setIndexController($name = 'index')
	{
		$this->_index_controller = $name;
	}
	
	/**
	 * Returns name of index controller
	 * @access public
	 * @return string    Name of index controller
	 */
	public function getIndexController()
	{
		return $this->_index_controller;
	}
	
	
	/**
	 * Sets name of index action
	 * @access public
	 * @param string $name    Name of index action
	 */
	public function setIndexAction($name = 'index')
	{
		$this->_index_action = $name;
	}
	
	/**
	 * Returns name of index action
	 * @access public
	 * @return string    Name of index action
	 */
	public function getIndexAction()
	{
		return $this->_index_action;
	}
	
	
	/**
	 * Sets name of error controller
	 * @access public
	 * @param string $name    Name of error controller
	 */
	public function setErrorController($name = 'error')
	{
		$this->_error_controller = $name;
	}
	
	/**
	 * Returns name of error controller
	 * @access public
	 * @return string    Name of error controller
	 */
	public function getErrorController()
	{
		return $this->_error_controller;
	}
	
	
	/**
	 * Sets name of error action
	 * @access public
	 * @param string $name    Name of error action
	 */
	public function setErrorAction($name = 'error')
	{
		$this->_error_action = $name;
	}
	
	/**
	 * Returns name of error action
	 * @access public
	 * @return string    Name of error action
	 */
	public function getErrorAction()
	{
		return $this->_error_action;
	}
	
	
	/**
	 * Set shorthand notation. If set, and Route is assembling url with given controller,
	 * action and single parameter, that triple will be replaced by given shorthand_name.
	 * Opposite replacement will be done, too. 
	 * Example:
	 * <code>
	 *   // An url - /pages/view/id/3, where controller='pages', action='view' and there is only one param='id' with value '3'
	 *   // will be asembled as /page/3, where 'page' is given shorthand name
	 *   $oRoute -> setShorthandNotation('pages', 'view', 'id', 'page');
	 * </code>
	 * Note. Shorthand notation takes precedence over standard url scheme. If shorthand notation key
	 *   coinsides with name of some controller, that controller will NEVER be called. That is why keys
	 *   of shorthand nonations should be different from controller names.
	 * @access public
	 * @param string $controller    Controller name
	 * @param string $action    Action name
	 * @param string $param    Parameter name
	 * @param string $shorthand_name    Shorthand name to be used in shorthand url
	 * @return array    Array of 'shorthand_name' => array('controller'=>xxx, 'action'=>xxx, 'param'=>xxx) pairs
	 */
	public function setShorthandNotation($controller, $action, $param, $shorthand_name)
	{
		$this->_shorthand_notations[$shorthand_name] = array('controller'=>$controller, 'action'=>$action, 'param'=>$param);
	}
	
	/**
	 * Returns list of all available shorthand notations
	 * @access public
	 * @return array    Array of 'shorthand_name' => array('controller'=>xxx, 'action'=>xxx, 'param'=>xxx) pairs
	 */
	public function getShorthandNotations()
	{
		return $this->_shorthand_notations;
	}
	
	
	
	
	/**
	 * Returns base url
	 * @access public
	 * @return string    Base url
	 */
	public function getBaseUrl()
	{
		return $this->_baseUrl;
	}

	/**
	 * Returns current module
	 * @access public
	 * @return string    Module name
	 */
	public function getModule()
	{
		return $this->_module;
	}
	
	/**
	 * Returns current controller
	 * @access public
	 * @return string    Controller name
	 */
	public function getController()
	{
		return $this->_controller;
	}
	
	/**
	 * Returns current action
	 * @access public
	 * @return string    Action name
	 */
	public function getAction()
	{
		return $this->_action;
	}
	
	/**
	 * Returns current language
	 * @access public
	 * @return string    Language name
	 */
	public function getLanguage()
	{
		return $this->_language;
	}
	
	/**
	 * Returns current url params
	 * @access public
	 * @return array    Url params
	 */
	public function getUrlParams()
	{
		return $this->_url_params;
	}
	
	
	/**
	 * Forward route to given module, controller or action
	 * @access public
	 * @param string $module    Module name. Pass null to use current module
	 * @param string $controller    Controller name. Pass null to use current controller
	 * @param string $action    Action name. Pass null to use current action
	 */
	public function forward($module, $controller, $action)
	{
		if(!empty($module))
			$this->_module = $module;
		if(!empty($controller))
			$this->_controller = $controller;
		if(!empty($action))
			$this->_action = $action;
	}
	
	
	/**
	 * Returns module/lang/controller/action part of url
	 * @access public
	 * @param string $module    Module name. Pass null to use current module
	 * @param string $lang    Language identifier. Pass null to use current language
	 * @param string $controller    Controller name. Pass null to use current controller
	 * @param string $action    Action name. Pass null to use current action
	 * @param array $params    Optional. Array with url params
	 * @param boolean $reset    Optional. Whenever to discard existing url params
	 * @return string    Constructed part of url
	 */
	public function assemble($module=null, $lang=null, $controller=null, $action=null, $params=null, $reset=false)
	{
		if(empty($module)) $module=$this->getModule();
		if(empty($lang)) $lang=$this->getLanguage();
		if(empty($controller)) $controller=$this->getController();
		if(empty($action)) $action=$this->getAction();

		//collect existing and new parameters
		$url_params = array();
		if(!$reset) //collect existing params, if there is not need to reset them
			$url_params += $this->getUrlParams();
		if(is_array($params)) //append new params
			$url_params += $params;
		
		//check if any shorthand notation can be used
		foreach($this->_shorthand_notations as $key=>$notation)
		{
			if($notation['controller'] == $controller && $notation['action'] == $action)
			{
				$param = $notation['param'];
				if(array_key_exists($param, $url_params))
				{
					$url_params = array($key=>$url_params[$param]) + $url_params;
					if($param != $key)
						unset($url_params[$param]);
					$action = '';
					$controller = '';
					break;
				}
			}
		}
		
		//combine parameters in a url string
		$params_part = array();
		foreach($url_params as $k=>$v)
		{
			$params_part[] = $k;
			$params_part[] = $v;
		}
		$params_part = implode('/', $params_part); //combine all collected params
		$params_part = trim($params_part, '/');
		
		//if there are no params, do not show default controller and action
		if(0 == count($url_params))
		{
			if($action==$this->getIndexAction())
			{
				$action = '';
				if($controller==$this->getIndexController()) $controller = '';
			}
		}
		
		//do not display default module in any case
		if($module==$this->getDefaultModule()) $module = '';
		
		//do not display default language in any case
		if($lang==$this->getDefaultLanguage()) $lang = '';
		
		//drop empty url parts from parts array
		$parts = array($module, $lang, $controller, $action, $params_part);
		$parts = array_filter($parts, create_function('$v', 'return !empty($v);'));
		
		return implode('/',$parts);
	}
	
	
	/**
	 * Parses request uri into class variables
	 * @access public
	 */
	public function init()
	{
		//set baseUrl
		$this->_parseBaseUrl();
		
		$parts = explode('/', $this->_getParsableUrlPart(), 5);
		
		//if no such module, replace it with default module
		$this->_module = $parts[0];
		if(!array_key_exists($this->_module, $this->_available_modules))
		{
			$this->_module = $this->getDefaultModule();
			if(null===$this->_module)
				throw new App_Exception('Request uses default module, but the name of default module is not specified!');
			array_splice($parts, 0, 0, array($this->_module));
		}
		
		//if no such language, replace it with default language
		$this->_language = $parts[1];
		if(!array_key_exists($this->_language, $this->_available_languages))
		{
			$this->_language = $this->getDefaultLanguage();
			if(null===$this->_language)
				throw new App_Exception('Request uses default language, but the default language is not specified!');
			array_splice($parts, 1, 0, array($this->_language));
		}
		
		//try to use shorthand notation
		$bShorthandNotationUsed = false;
		if(count($parts)>2)
		{
			$shorthand_key = $parts[2];
			foreach($this->_shorthand_notations as $key=>$notation)
			{
				if($key == $shorthand_key)
				{
					$this->_controller = $notation['controller'];
					$this->_action = $notation['action'];
					$parts[2] = $notation['param'];
					array_splice($parts, 2, 0, array($this->_controller));
					array_splice($parts, 3, 0, array($this->_action));
					$bShorthandNotationUsed = true;
					break;
				}
			}
		}
		
		//use standard /controller/action/param1/value1/param2/value2 scheme
		if(!$bShorthandNotationUsed)
		{
			$controller_action_error = false;
			$controller_action_regex = '/^[a-zA-Z0-9_-]+$/';
			
			//use 'error' controller, if invalid controller name provided, and 'index' controller - if empty
			$this->_controller = $parts[2];
			if(empty($this->_controller))
			{
				$this->_controller = $this->getIndexController();
				array_splice($parts, 2, 0, array($this->_controller));
			}
			elseif(!preg_match($controller_action_regex, $this->_controller))
			{
				$controller_action_error = true;
			}
			
			//use 'error' action, if invalid action name provided, and 'index' action - if empty
			$this->_action = $parts[3];
			if(empty($this->_action))
			{
				$this->_action = $this->getIndexAction();
				array_splice($parts, 3, 0, array($this->_action));
			}
			elseif(!preg_match($controller_action_regex, $this->_action))
			{
				$controller_action_error = true;
			}
			
			//if there are errors in controller/action processing, use error/error pair
			if(true === $controller_action_error)
			{
				$this->_controller = 'error';
				array_splice($parts, 2, 0, array($this->_controller));
				
				$this->_action = 'error';
				array_splice($parts, 3, 0, array($this->_action));
			}
		}
		
		//collecting params
		$params = array();
		for($i=4; $i<count($parts); ++$i)
		{
			$params[] = $parts[$i];
		}
		
		//parsing url params
		$this->_parseRequestParams(implode('/', $params));
	}
	
	
	/**
	 * Sets baseUrl member variable from url. baseUrl can be retrieved using getBaseUrl()
	 * @access protected
	 */
	protected function _parseBaseUrl()
	{
		if(!isset($_SERVER['SCRIPT_NAME']))
		{
			$url = '';
		}
		else
		{
			$script_name = $_SERVER['SCRIPT_NAME'];
			if(($pos = strripos($script_name, basename($_SERVER['SCRIPT_NAME']))) !== false)
			{
	            $url = substr($script_name, 0, $pos);
	        }
		}
		$this->_baseUrl = rtrim($url, '/').'/';
	}
	
	
	/**
	 * Returns part of url, which can be parsed by this route
	 * @access protected
	 * @return string    Part of url string
	 */
	protected function _getParsableUrlPart()
	{
		$path = dirname($_SERVER['PHP_SELF']);
		if($path == '\\' || $path == '/')
		{
			$pos = 0;
			$path = '';
		}
		else
		{
			$pos = strpos($_SERVER['REQUEST_URI'], $path);
		}
		if(0 === $pos)
		{
			$url = substr($_SERVER['REQUEST_URI'], $pos+strlen($path)+1);
		}
		return parse_url($url, PHP_URL_PATH);
	}
	
	
	/**
	 * Parses parameter part of url string. Parsed parameters can be retrieved using getUrlParams()
	 * @access protected
	 * @param string $url_params    Everything after module/lang/controller/action/ part and before ? mark from url
	 */
	protected function _parseRequestParams($url_params)
	{
		$url_params = trim($url_params, '/');
		$params = explode('/', $url_params);
		
		$this->_url_params = array();
		for($i=0; $i<count($params); $i+=2)
		{
			if(empty($params[$i])) continue;
			$this->_url_params[$params[$i]] = urldecode($params[$i+1]);
		}
	}
}
