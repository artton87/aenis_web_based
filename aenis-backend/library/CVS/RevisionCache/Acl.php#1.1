<?php
/**
 * Access control
 */


/**
 * Access control implementation. A singleton.
 * @author BestSoft
 */
class Acl
{
    /**
     * Collection key for storing permissions cache
	 * @var string
     */
    protected $_session_key = 'allowed_resources';

	/**
	 * Session namespace to use
	 * @var App_Session_Namespace
	 */
	protected $_session_ns = null;

	/**
	 * Whenever access control checking is enabled
	 * @var bool
	 */
	protected $_is_enabled = true;

	/**
	 * A single instance of this class
	 * @var App_Cache
	 */
	protected static $_instance = null;


	/**
	 * Protected constructor for singleton pattern implementation
	 */
	protected function __construct() {}


	/**
	 * Returns an instance of this class
	 * Session namespace is required
	 * @access public
	 * @static
	 * @return Acl
	 */
	public static function instance()
	{
		if(self::$_instance)
			return self::$_instance;

		/**
		 * Shorthand syntax for Acl::instance()
		 * @return Acl
		 */
		function Acl() {
			return Acl::instance();
		}

		self::$_instance = new self();
		return self::$_instance;
	}


	/**
	 * Sets session namespace for this object
	 * @access public
	 * @param App_Session_Namespace $ns    A session namespace to use
	 * @return Acl
	 */
	public function setSessionNamespace($ns)
	{
		$this->_session_ns = $ns;
		return $this;
	}


	/**
	 * Enable/disable access control checks
	 * @access public
	 * @param boolean $bEnable    Whenever to enable or disable
	 * @return Acl
	 */
	public function enable($bEnable = true)
	{
		$this->_is_enabled = $bEnable ? true : false;
		return $this;
	}


	/**
	 * Updates list of allowed resources
	 * @access public
	 * @param object|array $data    Array of allowed resource codes
	 */
	public function update($data)
	{
		$this->_session_ns->setItem('allowed_resources', new App_Session_Item_Object($data), $this->_session_key);
	}


	/**
	 * Reset list of allowed resources
	 * @access public
	 */
	public function reset()
	{
		$this->_session_ns->unsetCollection($this->_session_key);
	}


	/**
	 * Checks whenever all of the given resources are allowed
	 * @access public
	 * @param array|string $resources    A code of resource to check, or list of codes
	 * @param boolean $byId    Optional. If given, will check resource id instead of code
	 * @return boolean
	 */
	public function allowed($resources, $byId = false)
	{
		if(false === $this->_is_enabled) return true;

		if(!is_array($resources))
			$resources = array($resources);
		$allowed_resources = $this->_session_ns->getItem('allowed_resources', $this->_session_key);
		if(null === $allowed_resources)
		{
			return false;
		}
		$diff = array_diff($resources, $byId ? array_keys($allowed_resources) : $allowed_resources);
		return empty($diff);
	}


	/**
	 * Checks whenever at least one of given resources is denied
	 * @access public
	 * @param array|string $resources    A code of resource to check, or list of codes
	 * @param boolean $byId    Optional. If given, will check resource id instead of code
	 * @return boolean
	 */
	public function denied($resources, $byId = false)
	{
		if(false === $this->_is_enabled) return false;

		return !$this->allowed($resources, $byId);
	}
}
