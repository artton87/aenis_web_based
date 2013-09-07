<?php
/**
 * Simple dispatcher definition
 * @package Framework\Dispatcher
 */

 
/**
 * Simple dispatcher, which doesn't use controllers and views, and only calls script given by request url
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Simple implements App_Dispatcher_Interface
{
	/**
	 * @var string    Path to scripts directory, under which view scripts and partials are stored
	 */
	protected $_script_directory = '/';
	
	
	
	/**
	 * Sets path to scripts directory, under which php files are stored
	 * @access public
	 * @param string $path    Path to script directory
	 */
	public function setScriptDirectory($path)
	{
		$path = rtrim($path, '/\\');
		$this->_script_directory = $path.'/';
	}
	
	
	/**
	 * Returns path to scripts directory, under which php files are stored
	 * @access public
	 * @return string    Path to script directory
	 */
	public function getScriptDirectory()
	{
		return $this->_script_directory;
	}
	
	
	/**
	 * Dispatches current request
	 * @access public
	 */
	public function dispatch()
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

		$pos = strrpos($url, '?');
		$script_path = (FALSE === $pos) ? $url : substr($url, 0, $pos);
		
		$this->render($script_path);
	}
	
	
	/**
	 * Calls given php script
	 * @access protected
	 * @param string $script     Path to script's php file
	 * @throws App_Exception if unable to find matching script
	 */
	protected function render($script)
	{
		if(0 === preg_match('/^[a-zA-Z0-9\\._\\-\\\\\\/]+\\.php$/', $script))
			throw new App_Exception('Invalid script path given: '.$script, 404);
		
		$script = $this->_script_directory . $script;
		
		if(!file_exists($script) || !is_readable($script))
			throw new App_Exception('File '.$script.' does not exist or is not accessible', 404);
			
		include($script);
	}
}
