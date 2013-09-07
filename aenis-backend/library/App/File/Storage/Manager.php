<?php
/**
 * File storage management routines
 * @package Framework\File
 */

 
/**
 * Holds a list of file storage directories
 * @package Framework\File
 */
class App_File_Storage_Manager
{
	/**
	 * Configuration used for lazy initialization of storage paths array
	 * @access protected
	 * @see App_File_Storage_Manager::reset()
	 * @var array
	 */
	protected $_config = array();


	/**
	 * Array with file storage location details
	 * @access protected
	 * @var App_File_Storage_Location[]
	 */
	protected $_storage_locations = array();


	/**
	 * Cache adapter to be used for speeding-up storage searching
	 * @access protected
	 * @var App_Cache_Adapter_Abstract
	 */
	protected $_cacheAdapter = null;



	/**
	 * A constructor. Just calls reset() to set configuration to default state.
	 * @access public
	 */
	public function __construct()
	{
		$this->_id = __ClASS__.'_'.uniqid();
		$this->reset();
	}


	/**
	 * Sets cache adapter for this storage manager
	 * @access public
	 * @param App_Cache_Adapter_Abstract $cacheAdapter    A cache adapter to use. Pass NULL to disable existing adapter.
	 * @return App_File_Storage_Manager    Provides a fluent interface by returning the same object
	 */
	public function setCacheAdapter($cacheAdapter)
	{
		$this->_cacheAdapter = $cacheAdapter;
		return $this;
	}


	/**
	 * Initializes with paths to file storage locations.
	 * Initialization will be done in lazy manner, that is, StorageManager will not
	 * be fully initialized until storage paths will be required by some method or until
	 * init() method will be called.
	 * @access public
	 * @param array $paths    Paths to file storage location
	 * @return App_File_Storage_Manager    Provides a fluent interface by returning the same object
	 */
	public function initFromArray(array $paths)
	{
		asort($paths);
		$this->_config['array_config'] = $paths;
		return $this;
	}


	/**
	 * Initializes with database table, which holds storage locations.
	 * Initialization will be done in lazy manner, that is, StorageManager will not
	 * be fully initialized until storage paths will be required by some method or until
	 * init() method will be called.
	 * @access public
	 * @param App_Db_Adapter_Abstract $dba    A database adapter to be used for connecting to database
	 * @param string $table   Database table name
	 * @param string $key_field    Name of field with primary key
	 * @param string $path_field    Name of field with storage location path
	 * @return App_File_Storage_Manager    Provides a fluent interface by returning the same object
	 */
	public function initFromDb($dba, $table, $key_field = 'id', $path_field = 'path')
	{
		$this->_config['db_config'] = array(
			'dba' => $dba,
			'table' => (string)$table,
			'key_field' => (string)$key_field,
			'path_field' => (string)$path_field
		);
		return $this;
	}


	/**
	 * Returns TRUE if storage manager is fully initialized, that is, storage
	 * locations are loaded either via after calling init() directly or on demand.
	 * @access public
	 * @return boolean
	 */
	public function initialized()
	{
		return $this->_config['initialized'];
	}


	/**
	 * Loads storage locations using configuration set by initFromDb() or by initFromDb()
	 * @access public
	 * @throws App_Exception if configuration is missing or there is no valid storage location
	 */
	public function init()
	{
		if(empty($this->_config['array_config']) && empty($this->_config['db_config']))
			throw new App_Exception('Storage manager should be configured before calling init()');

		$this->_config['initialized'] = false;
		$this->_storage_locations = array();

		if(!empty($this->_config['array_config']))
		{
			foreach($this->_config['array_config'] as $key=>$path)
			{
				$this->_storage_locations[$key] = new App_File_Storage_Location($key, $path);
			}
		}
		if(!empty($this->_config['db_config'])) //select from database, ordering by path, ASC
		{
			$dba = $this->_config['db_config']['dba'];
			if(!$dba->isConnected())
				$dba->connect();
			$result = $dba->select(
				$this->_config['db_config']['table'],
				array($this->_config['db_config']['key_field'] => 'id', $this->_config['db_config']['path_field'] => 'path'),
				array(),
				array($this->_config['db_config']['path_field'] => 'ASC')
			);
			while($row = $dba->fetch_array($result))
			{
				$this->_storage_locations[$row['id']] = new App_File_Storage_Location($row['id'], $row['path']);
			}
		}

		//check for valid locations
		$writable_locations = array_filter($this->_storage_locations, 'App_File_Storage_Location::filter_writable');
		if(empty($writable_locations))
		{
			$locations = array();
			foreach($this->_storage_locations as $loc)
			{
				$locations[] = $loc->getPath(true);
			}
			throw new App_Exception('Configured storage locations ('.implode('; ', $locations).') are not writable');
		}

		$this->_config['initialized'] = true;
	}


	/**
	 * Resets storage locations and configuration
	 * @access public
	 */
	public function reset()
	{
		$this->_storage_locations = array();
		$this->_config = array(
			'db_config' => array(),
			'array_config' => array(),
			'initialized' => false
		);
		if(null !== $this->_cacheAdapter)
		{
			$this->_cacheAdapter->remove($this->_id);
		}
	}


	/**
	 * Return storage location by key.
	 * @access public
	 * @param string|integer $key    A key for storage location
	 * @return App_File_Storage_Location
	 */
	public function getStorageByKey($key)
	{
		if(!$this->initialized())
			$this->init(); //initialize on demand
		return $this->_storage_locations[$key];
	}


	/**
	 * Returns storage, which can hold file of $file_size size.
	 * @param integer $file_size    Size of file
	 * @param boolean $throw_exception    Optional. If TRUE, throws App_Exception if storage cannot be found
	 * @return App_File_Storage_Location|null    Null - if storage cannot be found, location object otherwise
	 * @throws App_Exception if storage cannot be found and $throw_exception=true
	 */
	public function getStorageByFileSize($file_size, $throw_exception = false)
	{
		if(!$this->initialized())
			$this->init(); //initialize on demand

		$cached_location_key = null;
		if(null !== $this->_cacheAdapter) //if cache adapter has been set up
		{
			if($cache = $this->_cacheAdapter->get($this->_id, true, true))
			{
				$location = $cache['location']; //try to use cached location first
				if($location->isWritable() && $location->canHold($file_size))
				{
					return $location;
				}
				else //cached location is not accessible
				{
					$cached_location_key = $location->getKey(); //remember its key to avoid checking it again
				}
			}
		}

		foreach($this->_storage_locations as $key=>$location)
		{
			if($cached_location_key !== $key && $location->isWritable() && $location->canHold($file_size))
			{
				if(null !== $this->_cacheAdapter) //if cache adapter has been set up
				{
					$this->_cacheAdapter->set($this->_id, array('location'=>$location), null, array(), true);
				}
				return $location;
			}
		}
		if($throw_exception)
		{
			$writable_locations = array_filter($this->_storage_locations, 'App_File_Storage_Location::filter_writable');
			$searched_in = array();
			foreach($writable_locations as $loc)
			{
				$searched_in[] = $loc->getPath();
			}
			throw new App_Exception('Cannot find a suitable storage path, while searching in '.implode('; ', $searched_in));
		}
		return null;
	}
}
