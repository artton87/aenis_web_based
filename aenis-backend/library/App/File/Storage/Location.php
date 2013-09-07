<?php
/**
 * File storage location routines
 * @package Framework\File
 */

 
/**
 * Holds a single file storage location
 * @package Framework\File
 */
class App_File_Storage_Location
{
	/**
	 * Unique key which identifies location
	 * @access protected
	 * @var integer|string
	 */
	protected $key = 0;

	/**
	 * Full path to location
	 * @access protected
	 * @var string
	 */
	protected $path = '';

	/**
	 * Whenever this location is writable
	 * @access protected
	 * @var boolean
	 */
	protected $is_writable = false;

	/**
	 * Whenever disk_free_space function is enabled
	 * @static
	 * @access protected
	 * @var boolean
	 */
	protected static $disk_free_space_fn_enabled = null;

	/**
	 * Root path for all storage locations
	 * @static
	 * @access protected
	 * @var string
	 */
	protected static $storage_root_path = '/';


	/**
	 * Sets root path for all storage locations
	 * @static
	 * @access public
	 * @param string $path    Root path for all storage locations
	 */
	public static function setStorageRootPath($path)
	{
		$path = rtrim($path, '/\\');
		self::$storage_root_path = $path.'/';
	}


	/**
	 * A constructor. Just calls reset() to set configuration to default state.
	 * @access public
	 * @param string $key    Key of storage
	 * @param string $path    Path to storage
	 */
	public function __construct($key, $path)
	{
		if(!empty($path))
		{
			$path = rtrim($path, '/\\');
			$this->key = (null === $key) ? 0 : $key;
			$this->path = $path.'/';
		}
		else
		{
			$this->path = $path;
		}
		$this->is_writable = (file_exists(self::$storage_root_path.$this->path) && is_writable(self::$storage_root_path.$this->path));
		if(null === self::$disk_free_space_fn_enabled)
		{
			$fns = App_Exception::getPHPDisabledFunctions();
			self::$disk_free_space_fn_enabled = (in_array('disk_free_space',$fns) || in_array('diskfreespace',$fns));
		}
	}


	/**
	 * Return TRUE if location is writable, FALSE otherwise
	 * @access public
	 * @return boolean
	 */
	public function isWritable()
	{
		return $this->is_writable;
	}


	/**
	 * Returns location path
	 * @access public
	 * @param boolean $return_full_path    Optional. If TRUE, returns full path of storage location
	 * @return string
	 */
	public function getPath($return_full_path = false)
	{
		return $return_full_path ? self::$storage_root_path.$this->path : $this->path;
	}


	/**
	 * Returns location key
	 * @access public
	 * @return string
	 */
	public function getKey()
	{
		return $this->key;
	}


	/**
	 * Return TRUE if location has enough free space to hold file of given size
	 * @access public
	 * @param integer $file_size    Size of file
	 * @return boolean
	 */
	public function canHold($file_size)
	{
		if(!self::$disk_free_space_fn_enabled)
		{
			return true;
		}
		clearstatcache(true, self::$storage_root_path.$this->path);
		return ($file_size < @disk_free_space(self::$storage_root_path.$this->path));
	}


	/*
	 * A callback function for array_filter calls.
	 * Appends $location path to the $result array.
	 * @static
	 * @access public
	 * @param App_File_Storage_Location $location
	 * @return boolean
	 */
	public static function filter_writable($location)
	{
		return $location->isWritable();
	}
}
