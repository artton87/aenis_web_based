<?php
/**
 * Autoloader implementation
 * @package Framework\Loader
 */

 
/**
 * Provides automatic loading functionality
 * @package Framework\Loader
 */
class App_Loader
{
	/**
     * @static
     * @var App_Loader    Singleton instance
     */
    protected static $_instance;
    
    /**
     * @var array    Path to include directory root
     */
    protected $_include_paths = '';
    
    
    /**
     * Sets include paths, where application includes reside
     * @access public
     * @param array $paths    Array with include paths
     */
    public function setIncludePaths(array $paths)
    {
    	$this->_include_paths = array();
    	foreach($paths as $path)
    	{
    		$path = rtrim($path, '/\\');
			$this->_include_paths[] = $path.'/';
    	}
    }
    
    /**
     * Returns current include paths, where application includes resides
     * @access public
     * @return array
     */
    public function getIncludePaths()
    {
		return $this->_include_paths;
    }
    
    
    /**
     * Initializes a loader instance
     * @static
     * @access public
     * @param array $include_paths   Array with include paths
     */
    public static function init(array $include_paths)
    {
		$self = self::getInstance();
		$self->setIncludePaths($include_paths);
    }
    
    
	/**
     * Retrieve singleton instance
     * @static
     * @access public
     * @return App_Loader
     */
    public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    
    /**
     * Reset the singleton instance
     * @static
     * @access public
     * @return void
     */
    public static function resetInstance()
    {
        self::$_instance = null;
    }
    
    
    /**
     * Constructor. Registers instance with spl_autoload stack
     * @access protected
     */
    protected function __construct()
    {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }
    
    
	/**
     * Autoload a class
     * @static
     * @access public
     * @param string $class 
     * @return boolean    TRUE, if class has been found, FALSE - otherwise
     */
    public static function autoload($class)
    {
        $self = self::getInstance();
        if(class_exists($class, false) || interface_exists($class, false)) return TRUE;
        
        $bFound = false;
        $class_path = $self->classNameToPath($class);
        $paths = $self->getIncludePaths();
        foreach($paths as $path)
        {
			if(file_exists($path.$class_path) && is_readable($path.$class_path))
			{
				self::loadFile($path.$class_path);
				if(class_exists($class, false) || interface_exists($class, false))
				{
					$bFound = true;
					break;
				}
			}
        }
        return $bFound;
    }
    
    
    /**
     * Returns class name using given path
     * @access public
     * @param string $path    Path to file
	 * @throws App_Exception if given path is invalid
     * @return string
     */
    public function pathToClassname($path)
    {
		$dirs = preg_split('\\\\|\/', $path);
		$c = count($dirs);
		if($c>0)
		{
			$class = $dirs[$c-1];
			$pos = strrpos($class, '.php');
			if($pos!==FALSE)
			{
				$dirs[$c-1] = substr($class, 0, $pos);
				return implode('_', $dirs);
			}
		}
		throw new App_Exception('Invalid path given.');
    }
    
    
    /**
     * Returns path to class file name using class name
     * @access public
     * @param string $className    Class name
     * @return string
     */
    public function classNameToPath($className)
    {
    	return str_replace('_', '/', $className) . '.php';
    }
    
    
    /**
     * Loads file at given path
     * @static
     * @access public
     * @param string $file    Path to file
	 * @throws App_Exception if illegal character exist in file name
     */
    public static function loadFile($file)
    {
    	if(preg_match('/[^a-z0-9\\/\\\\_.:-]/i', $file))
    	{
            throw new App_Exception('Security check: Illegal character in filename');
        }
        if(file_exists($file) && is_readable($file))
        {
			include_once($file);
        }
    }
}
