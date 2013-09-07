<?php
/**
 * Universal dispatcher definition
 * @package Framework\Dispatcher
 */

 
/**
 * Universal dispatcher, which handles urls in module/language/controller/action format, uses controllers and views
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal implements App_Dispatcher_Interface
{
	/**
	 * @var App_Route_Universal    Application route
	 */
	protected $_route = null;
	
	/**
	 * @var App_Translate    An App_Translate object, used for rendering views
	 */
	protected $_translator = null;
	
	/**
	 * @var App_Request    An App_Request object, used for getting request parameters
	 */
	protected $_request = null;
	
	/**
	 * @var boolean    Whenever to render view after calling controller action
	 */
	protected $_bViewEnabled = true;
	
	/**
	 * @var boolean    Whenever to render view layout
	 */
	protected $_bLayoutEnabled = true;
	
	
	/**
	 * Class constructor
	 * @access public
	 * @param App_Route_Universal $oRoute    An App_Route_Universal object, used for parsing url strings
	 * @param App_Translate $oTranslator    An App_Translate object, used for rendering views
	 * @return App_Dispatcher_Universal
	 */
	public function __construct($oRoute = null, $oTranslator = null)
	{
		if(null!==$oRoute)
			$this->setRoute($oRoute);
		if(null!==$oTranslator)
			$this->setTranslator($oTranslator);
		$this->_request = new App_Request();
	}
	
	
	
	
	/**
	 * Sets App_Translate object, used for rendering views
	 * @access public
	 * @param App_Translate $oTranslator    An App_Translate object
	 */
	public function setTranslator($oTranslator)
	{
		$this->_translator = $oTranslator;
	}
	
	/**
	 * Returns App_Translate object, used for rendering views
	 * @access public
	 * @return App_Translate    An App_Translate object
	 */
	public function getTranslator()
	{
		return $this->_translator;
	}
	
	
	/**
	 * Returns App_Request object, holding current request parameters
	 * @access public
	 * @return App_Request    An App_Request object
	 */
	public function getRequest()
	{
		return $this->_request;
	}
	
	
	/**
	 * Sets App_Route_Universal object, used for parsing url string
	 * @access public
	 * @param App_Route_Universal $oRoute    An App_Route_Universal object
	 */
	public function setRoute($oRoute)
	{
		$this->_route = $oRoute;
	}
	
	/**
	 * Returns App_Route_Universal object, used for parsing url string
	 * @access public
	 * @return App_Route_Universal    An App_Route_Universal object
	 */
	public function getRoute()
	{
		return $this->_route;
	}
	
	
	/**
	 * Enables/disables view rendering. When view is disabled, controller is responsible for sending output to browser.
	 * This method should be called before view redering begins, that is, in controller action method.
	 * @access public
	 * @param boolean $bEnable    Whenever to enable - TRUE or disable - FALSE
	 */
	public function enableView($bEnable = true)
	{
		$this->_bViewEnabled = $bEnable;
	}
	
	/**
	 * Enables/disables layout rendering. When layout is disabled, every output will be sent to browser.
	 * This method should be called before layout redering begins, that is, in controller action method.
	 * @access public
	 * @param boolean $bEnable    Whenever to enable - TRUE or disable - FALSE
	 */
	public function enableLayout($bEnable = true)
	{
		$this->_bLayoutEnabled = $bEnable;
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
		$this->_route->forward($module, $controller, $action);
		return $this->_init_controller();
	}
	
	
	/**
	 * Dispatch current request, calls appropriate controller action method, renders appropriate view scripts
	 * @access public
	 */
	public function dispatch()
	{
		//initialize route variables
		$this->_route->init();
		
		//append route parameters to request
		foreach($this->_route->getUrlParams() as $k=>$v)
		{
			$_GET[$k] = $v;
		}
		
		//load translator strings
		$this->_translator->loadTranslations($this->_route->getLanguage(), $this->_route->getModule());
		
		//call controller action
		$oController = $this->_init_controller();
		
		//call view, if view is enabled
		if($this->_bViewEnabled)
		{
			$view = $oController->getView();
			$content_script = $this->_route->getController().'/'.$this->_route->getAction().'.php';
			if($this->_bLayoutEnabled)
			{
				//render content into placeholder
				$oPlaceholderHelper = $view->helperPlaceholder();
				if(null !== $oPlaceholderHelper)
				{
					$oPlaceholderHelper->captureScript('content', $content_script);
				}
				
				//render whole layout
				$view->render('layout.php');
			}
			else
			{
				$view->render($content_script);
			}
		}
	}
	
	
	/**
	 * Calls controller action method
	 * @access protected
	 * @throws App_Exception if action cannot be found
	 * @return App_Dispatcher_Universal_Controller_Abstract    Initialized controller object
	 */
	protected function _init_controller()
	{
		$controller = $this->_route->getController();
		$action = $this->_route->getAction();
		
		$class = ucwords($controller).'Controller';
		$method = $action.'Action';
		
		$oController = null;
		try {
			if(!class_exists($class, false))
			{
				$file = $this->_route->getModulesPath().$this->_route->getModule().'/controllers/'.$class.'.php';
				App_Loader::loadFile($file);
				if(!class_exists($class, false))
					throw new App_Exception("The controller class $class cannot be found in file $file");
			}
			
			$oController = new $class();
			if(!method_exists($oController, $method))
				throw new App_Exception("The method $method for action $action cannot be found in class $class");
				
			$view = new App_Dispatcher_Universal_View();
			$view->setDispatcher($this);
			$oController->setView($view);
		}
		catch(App_Exception $e)
		{
			if($controller == $this->_route->getErrorController() && $action == $this->_route->getErrorAction())
			{
				//even error action of error controller cannot be found, throw exception
				throw new App_Exception($e->getMessage());
			}
			else
			{
				//forward to error action of error controller
				return $this->forward(null, $this->_route->getErrorController(), $this->_route->getErrorAction());
			}
		}
		
		$oController->setDispatcher($this);
		call_user_func_array(array($oController, 'beforeActionCallback'), array());
		call_user_func_array(array($oController, $method), array());
		return $oController;
	}
}