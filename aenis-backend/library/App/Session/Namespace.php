<?php
/**
 * Session namespace definition
 * @package Framework\Session
 */

 
/**
 * A class for working with session namespaces.
 * Session namespace is a group of one or many session variables, which can be grouped into subgroups, called collections.
 * Each collection is identified by unique key.
 * @package Framework\Session
 */
class App_Session_Namespace
{
	/**
	 * @var string    Name of this session namespace
	 */
	protected $_name = '';
	
	
	/**
	 * Constructor. Sets namespace name.
	 * @access public
	 * @param string $name
	 * @return App_Session_Namespace
	 * @throws App_Exception if session name is not given
	 */
	public function __construct($name)
	{
		if(empty($name))
			throw new App_Exception('Session namespace name cannot be empty!');
		$this->_name = $name;
		if(!array_key_exists($this->_name, $_SESSION))
		{
			$_SESSION[$this->_name] = array();
		}
	}
	
	
	/**
	 * Returns name of session namespace
	 * @access public
	 * @return string    Name of session namespace
	 */
	public function getName()
	{
		return $this->_name;
	}
	
	
	/**
	 * Clear all variables from the namespace
	 * @access public
	 */
	public function clear()
	{
		$_SESSION[$this->_name] = array();
	}
	
	
	/**
     * Register variable in the session.
     * @access public
     * @param string $item_name    Name of variable
     * @param App_Session_Item_Abstract $item    An object of App_Session_Item_Abstract derived type
     * @param string $collection_key   Optional. A unique key, identifying collection
     */
    public function setItem($item_name, $item, $collection_key = '')
    {
        $this->setItems(array($item_name => $item), $collection_key);
    }
    
    
    /**
     * Register an array of variables in the session.
     * @access public
     * @param array $items    An array of objects of App_Session_Item_Abstract derived type
     * @param string $collection_key   Optional. A unique key, identifying collection
     */
    public function setItems($items, $collection_key = '')
    {
        $collection_key = $this->_getSafeCollectionKey($collection_key);
        
        if(!$this->collectionExists($collection_key))
			$_SESSION[$this->_name][$collection_key] = array();
        
        foreach($items as $name => $sessionItemObj)
        {
        	//if(is_subclass_of($sessionItemObj, 'App_Session_Item_Abstract'))
        	if(is_object($sessionItemObj))
        	{
           		if($sessionItemObj->isReady())
               		$_SESSION[$this->_name][$collection_key][$name] = $sessionItemObj->getValue();
			}
			else
			{
				$_SESSION[$this->_name][$collection_key][$name] = $sessionItemObj;
			}
        }
    }
    
    
    /**
     * Return value of session variable
     * @access public
     * @param string $item_name    Name of variable
     * @param string $collection_key   Optional. A unique key, identifying collection
     * @return mixed    Variable value or NULL, if variable doesn't exist in collection
     */
    public function getItem($item_name, $collection_key = '')
    {
        $vec = $this->getItems(array($item_name), $collection_key);
        foreach($vec as $value) return $value;
        return NULL;
    }
    
    
    /**
     * Return array of values of session variables, which exist in collection
     * @access public
     * @param array $item_names    Array with names of variables, to be retrieved.
     * @param string $collection_key   Optional. A unique key, identifying collection
     * @return array
     */
    public function getItems($item_names, $collection_key = '')
    {
        $collection_key = $this->_getSafeCollectionKey($collection_key);
        if(!$this->collectionExists($collection_key))
        {
        	return array();
		}
        $vec = array();
        foreach($item_names as $name)
        {
            if(array_key_exists($name, $_SESSION[$this->_name][$collection_key]))
            {
                $vec[$name] = $_SESSION[$this->_name][$collection_key][$name];
            }
        }
        return $vec;
    }
    
    
    /**
     * Unregister a single session variable from session collection
     * @access public
     * @param string $item_name    Name of variable
     * @param string $collection_key   Optional. A unique key, identifying collection
     */
    public function unsetItem($item_name, $collection_key = '')
    {
        $this->unsetItems(array($item_name), $collection_key);
    }
    
    
    /**
     * Unregister multiple session variables from session collection
     * @access public
     * @param array $item_names    Array with variable names.
     * @param string $collection_key   Optional. A unique key, identifying collection
     */
    public function unsetItems($item_names, $collection_key = '')
    {
        $collection_key = $this->_getSafeCollectionKey($collection_key);
        if($this->collectionExists($collection_key))
        {
	        foreach($item_names as $name)
	            unset($_SESSION[$this->_name][$collection_key][$name]);
		}
    }
    
    
    /**
     * Destroys the whole session collection
     * @access public
     * @param string $collection_key   Optional. A unique key, identifying collection
     */
    public function unsetCollection($collection_key = '')
    {
        $collection_key = $this->_getSafeCollectionKey($collection_key);
        unset($_SESSION[$this->_name][$collection_key]);
    }
    
    
    /**
     * Checks if given namespace collection exists
     * @access public
     * @param string $collection_key   A unique key, identifying collection
     */
    public function collectionExists($collection_key)
    {
		return array_key_exists($collection_key, $_SESSION[$this->_name]);
    }
    
    
    /**
     * Return 'safe' collection key. Collection key in all functions
     * should be passed through this function before any other actions.
     * @access protected
     * @param string  $collection_key   A collection key
     */
    protected function _getSafeCollectionKey($collection_key)
    {
        $collection_key = trim($collection_key);
        return empty($collection_key) ? '__default' : $collection_key;
    }
    
    
    /**
     * Returns string representation of namespace
     * @access public
     */
    public function __toString()
    {
		return print_r($_SESSION[$this->_name], 1);
    }
    
    
    /**
     * Same as setItem($name, $value)
     * @access public
     * @see setItem
     * @param string $name    Name of variable
     * @param App_Session_Item_Abstract $value    An object of App_Session_Item_Abstract derived type
     */
    public function __set($name, $value)
    {
		$this->setItem($name, $value);
    }
    
    /**
     * Same as getItem($name)
     * @access public
     * @see getItem
     * @param string $name    Name of variable
     */
    public function __get($name)
    {
		return $this->getItem($name);
    }
}
