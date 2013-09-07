<?php
/**
 * File-based cache adapter definition
 * @package Framework\Cache
 */

 
/**
 * File-based cache adapter
 * @package Framework\Cache
 */
class App_Cache_Adapter_File extends App_Cache_Adapter_Abstract
{
	/**
	 * @var string   Path to cache directory
	 */
	protected $_cache_path = null;
	
	/**
	 * @var string   Prefix for cache files
	 */
	protected $_cache_prefix = 'c-#';
	
	/**
	 * @var string   Path to cache metadata directory
	 */
	protected $_metadata_path = null;
	
	/**
	 * @var string   Prefix for metadata files
	 */
	protected $_metadata_prefix = 'm-#';
	
	/**
	 * @var integer    Octal mask for directories used for cache and metadata
	 */
	protected $_path_mask = 0700;
	
	/**
	 * @var integer    Octal mask for files used for storing cache and metadata
	 */
	protected $_file_mask = 0600;
	
	/**
	 * @var integer    Garbage collector running interval in seconds. 0 disables garbage collection.
	 */
	protected $_gc_interval = 0;
	
	
	/**
	 * Constructor. Sets paths for cache storage and some properties.
	 * If called without arguments, will try to use a subdirectory of system tmp directory for cache storage.
	 * @access public
	 * @param string $cache_path    Path to cache directory. Path should be writable by PHP
	 * @param string $metadata_path    Path to metadata directory. Path should be writable by PHP
	 * @param boolean $bCreateDirectories    Optional. If given, creates writable cache directory if it does not exist
	 * @param integer $path_mask    Optional. A directory mask as octal number
	 * @param integer $file_mask    Optional. A file mask as octal number
	 */
	public function __construct($cache_path = '', $metadata_path = '', $bCreateDirectories = false, $path_mask = 0700, $file_mask = 0600)
	{
		$this->setPathMask($path_mask);
		$this->setFileMask($file_mask);
		if(empty($cache_path) || empty($metadata_path))
		{
			$tmp_dir = self::getTmpDir() . DIRECTORY_SEPARATOR;
			
			if(empty($cache_path))
			{
				$cache_path = $tmp_dir.'app_framework_cache'.DIRECTORY_SEPARATOR;
				$this->setCachePath($cache_path, true);
			}
			
			if(empty($metadata_path))
			{
				$metadata_path = $tmp_dir.'app_framework_cache_metadata'.DIRECTORY_SEPARATOR;
				$this->setMetadataPath($metadata_path, true);
			}
		}
		else
		{
			$this->setCachePath($cache_path, $bCreateDirectories);
			$this->setMetadataPath($metadata_path, $bCreateDirectories);
		}
	}
	
	
	/**
	 * Destructor. Checks if garbage collection is activated and if yes run GC engine
	 */
	public function __destruct()
	{
		if($this->_gc_interval > 0) //GC engine is activated
		{
			$gc_file = $this->_metadata_path.'gc';
			
			$mtime = @filemtime($gc_file);
			if(!$mtime) //no gc file exists, create a new one
			{
				@touch($gc_file);
				$mtime = @filemtime($gc_file);
			}
			if($mtime && (time() > $mtime + $this->_gc_interval)) //gc interval expired
			{
				$this->clean(); //clean garbage
				clearstatcache();
				@touch($gc_file);
			}
		}
	}
	
	
	/**
	 * Sets mask for cache and metadata files
	 * @access public
	 * @param integer $mask    A file mask as octal number
	 */
	public function setFileMask($mask)
	{
		$this->_file_mask = $mask;
	}
	
	
	/**
	 * Returns file mask
	 * @access public
	 * @return integer    A file mask as octal number
	 */
	public function getFileMask()
	{
		return $this->_file_mask;
	}
	
	
	/**
	 * Sets mask for cache and metadata directories
	 * @access public
	 * @param integer $mask    A directory mask as octal number
	 */
	public function setPathMask($mask)
	{
		$this->_path_mask = $mask;
	}
	
	
	/**
	 * Returns directory mask
	 * @access public
	 * @return integer    A directory mask as octal number
	 */
	public function getPathMask()
	{
		return $this->_path_mask;
	}
	
	
	/**
	 * Sets path to the cache directory
	 * @access public
	 * @param string $path    A path to be used. Path should be writable by PHP
	 * @param boolean $bCreate    Optional. If given, creates writable cache directory if it does not exist
	 * @throws App_Cache_Adapter_Exception if path is not writable directory
	 */
	public function setCachePath($path, $bCreate = false)
	{
		$is_dir = is_dir($path);
		if($is_dir)
			$path = realpath($path);
		$path = rtrim($path, '/\\');
		
		if($bCreate && !$is_dir)
		{
			@mkdir($path, $this->_path_mask, true);
			$is_dir = is_dir($path);
		}
		
		if(!$is_dir)
			throw new App_Cache_Adapter_Exception("Given cache path $path is not a directory");
		
		if(!is_writable($path))
			throw new App_Cache_Adapter_Exception("Given cache path $path is not writable");
		
		$this->_cache_path = $path . DIRECTORY_SEPARATOR;
	}
	
	
	/**
	 * Returns path to cache directory
	 * @access public
	 * @return string    A path to cache directory
	 */
	public function getCachePath()
	{
		return $this->_cache_path;
	}
	
	
	/**
	 * Sets path to the cache metadata directory
	 * @access public
	 * @param string $path    A path to be used. Path should be writable by PHP
	 * @param boolean $bCreate    Optional. If given, creates writable metadata directory if it does not exist
	 * @throws App_Cache_Adapter_Exception if path is not writable directory
	 */
	public function setMetadataPath($path, $bCreate = false)
	{
		$is_dir = is_dir($path);
		if($is_dir)
			$path = realpath($path);
		$path = rtrim($path, '/\\');
		
		if($bCreate && !$is_dir)
		{
			@mkdir($path, $this->_path_mask, true);
			$is_dir = is_dir($path);
		}
		
		if(!$is_dir)
			throw new App_Cache_Adapter_Exception("Given cache metadata path $path is not a directory");
		
		if(!is_writable($path))
			throw new App_Cache_Adapter_Exception("Given cache metadata path $path is not writable");
		
		$this->_metadata_path = $path . DIRECTORY_SEPARATOR;
	}
	
	
	/**
	 * Returns path to cache metadata directory
	 * @access public
	 * @return string    A path to cache metadata directory
	 */
	public function getMetadataPath()
	{
		return $this->_metadata_path;
	}
	
	
	/**
	 * Sets garbage collection (GC) interval / activates GC engine.
	 * A cached entry is considered garbage, if its lifetime is expired.
	 * GC will check whole cache directory for expired entries and will remove them from disk thus freeing disk space.
	 * It is disk intensive operation and it maybe be unsafe to turn on GC on hardware with slow disk writes.
	 * @access public
	 * @param integer $seconds    After how many seconds to run GC. 0 - disables GC
	 */
	public function setGarbageCollectionInterval($seconds)
	{
		$this->_gc_interval = ($seconds > 0) ? $seconds : 0;
	}
	
	
	/**
	 * Append given data to cache. Implementation of App_Cache_Adapter_Abstract.
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param mixed $data    A string data to be cached
	 * @param integer $lifetime     Optional lifetime for that cache record in seconds.
	 * 							    Value of NULL means cache will not expire and remain 'forever'.
	 * @param array $tags    Optional. An array of tags for that cache entry
	 * @param boolean $serialize    Optional. If given, will serialize data before caching
	 * @throws App_Cache_Adapter_Exception
	 */
	public function set($id, $data, $lifetime = null, array $tags = array(), $serialize = false)
	{
		if(!preg_match('/^[A-Za-z\\.\\-_0-9]+$/', $id))
        	throw new App_Cache_Adapter_Exception("Given cache ID ($id) is not a valid ID. ID should consist of characters A-Z, a-z, ., -, 0-9");

		if($serialize)
			$data = serialize($data);

		$cache_file = $this->_cache_path.$this->_cache_prefix.$id;
		$cache_ok = @file_put_contents($cache_file, $data, null);
        if(false !== $cache_ok)
        {
        	@chmod($cache_file, $this->_file_mask);
			$mtime = time();
			$metadata = array(
				'id' => $id,
				'modified_time' => $mtime,
				'expire_time' => is_null($lifetime) ? 9999999999 : $mtime + $lifetime,
				'tags' => array_unique(is_array($tags) ? $tags : array($tags))
		    );
		    
			$metadata_file = $this->_metadata_path.$this->_metadata_prefix.$id;
			$metadata_ok = $this->_save_metadata_file($metadata_file, $metadata);
			if($metadata_ok) 
				@chmod($metadata_file, $this->_file_mask);
			else
				@unlink($metadata_file);
		}
		else
		{
			@unlink($cache_file);
        }
        
        if(!$cache_ok)
        	throw new App_Cache_Adapter_Exception("Unable to cache data in $cache_file");
		if(!$metadata_ok)
        	throw new App_Cache_Adapter_Exception("Unable to write cache metadata to $metadata_file");
	}
	
	
	/**
	 * Returns given cache entry
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param boolean $checkValidity    Optional. Whenever to check for valid cache entry before reading it
	 * @param boolean $unserialize    Optional. Whenever to unserialize cached data before returning it
	 * @return string|boolean    Cached data if any, FALSE - of cache does not exist or is not valid
	 */
	public function get($id, $checkValidity = true, $unserialize = false)
	{
		if($checkValidity && !$this->isCached($id)) return false;
		$data = @file_get_contents($this->_cache_path.$this->_cache_prefix.$id, false);
		if($unserialize && false !== $data)
		{
			return unserialize($data);
		}
		return $data;
	}
	
	
	/**
	 * Safely remove given cache entry. Implementation of App_Cache_Adapter_Abstract.
	 * NOTE. It is safe to call this method also if cache entry does not exists.
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 */
	public function remove($id)
	{
		@unlink($this->_metadata_path.$this->_metadata_prefix.$id);
		@unlink($this->_cache_path.$this->_cache_prefix.$id);
	}
	
	
	/**
	 * Check if the given entry exists in cache. Implementation of App_Cache_Adapter_Abstract.
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @return boolean|mixed    "Last modified" timestamp (int) of the available cache record, FALSE - if cache is not available
	 */
	public function isCached($id)
	{
		$metadata = $this->_read_metadata_by_id($id);
		if(false !== $metadata && time() <= $metadata['expire_time'])
		{
			return $metadata['modified_time'];
		}
		return false;
	}

	
	/**
	 * Clean expired cached data and metadata. Implementation of App_Cache_Adapter_Abstract.
	 * @access public
	 */
	public function clean()
	{
		$time = time();
		$it = new GlobIterator(
			$this->_metadata_path.$this->_metadata_prefix.'*',
			FilesystemIterator::KEY_AS_PATHNAME | FilesystemIterator::CURRENT_AS_FILEINFO
		);
		foreach ($it as $metadata_file=>$fi)
		{
			if(!$fi->isFile()) continue;
			if($metadata = $this->_read_metadata_file($metadata_file))
			{
				if($time > $metadata['expire_time'])
				{
					$this->remove($metadata['id']);
				}
			}
		}
	}
	
	
	/**
	 * Purges all cached data and metadata. Implementation of App_Cache_Adapter_Abstract.
	 * @access public
	 */
	public function purge()
	{
		$it = new GlobIterator(
			$this->_cache_path.$this->_cache_prefix.'*',
			FilesystemIterator::KEY_AS_PATHNAME | FilesystemIterator::CURRENT_AS_FILEINFO
		);
		foreach ($it as $cache_file=>$fi)
		{
			if($fi->isFile())
				@unlink($cache_file);
		}
		
		$it = new GlobIterator(
			$this->_metadata_path.$this->_metadata_prefix.'*',
			FilesystemIterator::KEY_AS_PATHNAME | FilesystemIterator::CURRENT_AS_FILEINFO
		);
		foreach ($it as $metadata_file=>$fi)
		{
			if($fi->isFile())
				@unlink($metadata_file);
		}
	}
	
	
	/**
	 * Tag the given cache entry
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param array|string $tags    Tag(s) to use
	 * @return boolean    TRUE on success, FALSE and NULL - on errors
	 */
	public function appendTags($id, $tags)
	{
		$tags = array_unique(is_array($tags) ? $tags : array($tags));
		$metadata_file = $this->_metadata_path.$this->_metadata_prefix.$id;
		if($metadata = $this->_read_metadata_file($metadata_file))
		{
			$metadata['tags'] += $tags;
			return $this->_save_metadata_file($metadata_file, $metadata);
		}
		return false;
	}
	
	
	/**
	 * Removes tag(s) from the given cache entry
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param array|string $tags    Tag(s) to remove
	 * @return boolean    TRUE denotes success, FALSE and NULL - write errors
	 */
	public function removeTags($id, $tags)
	{
		$metadata_file = $this->_metadata_path.$this->_metadata_prefix.$id;
		if($metadata = $this->_read_metadata_file($metadata_file))
		{
			$metadata['tags'] = array_diff($metadata['tags'], $tags);
			$metadata['tags'] = array_values($metadata['tags']);
			return $this->_save_metadata_file($metadata_file, $metadata);
		}
		return false;
	}
	
	
	/**
	 * Refresh all cache entries tagged with the given tag(s)
	 * @access public
	 * @param array|string $tags    Tag(s) to refresh
	 */
	public function refreshTags($tags)
	{
		$time = time();
		if(!is_array($tags))
			$tags = array($tags);
		$tags = array_unique($tags);
		$it = new GlobIterator(
			$this->_metadata_path.$this->_metadata_prefix.'*', 
			FilesystemIterator::KEY_AS_PATHNAME | FilesystemIterator::CURRENT_AS_FILEINFO
		);
		foreach ($it as $metadata_file=>$fi)
		{
			if(!$fi->isFile()) continue;
			if($metadata = $this->_read_metadata_file($metadata_file))
			{
				if($time > $metadata['expire_time']) continue; //already expired
				
				$matching = false;
                foreach($tags as $tag)
                {
					if(in_array($tag, $metadata['tags']))
					{
						$matching = true;
						break;
					}
                }
				if($matching)
				{
					$metadata['expire_time'] = 1;
					$this->_save_metadata_file($metadata_file, $metadata);
				}
			}
		}
	}
	
	
	/**
	 * Reads metadata of given cache entry
	 * @access protected
	 * @param string $id    A valid cache ID
	 * @return array|null    An array with 'modified_time' (timestamp), 'expire_time' (timestamp), 'tags' (array) keys.
	 * 						 NULL - on error.
	 */
	protected function _read_metadata_by_id($id)
	{
		$metadata_file = $this->_metadata_path.$this->_metadata_prefix.$id;
		return $this->_read_metadata_file($metadata_file);
	}
	
	
	/**
	 * Reads metadata file of given cache entry
	 * @access protected
	 * @param string $metadata_file    A metadata file pathname
	 * @return array|boolean    An array with 'modified_time' (timestamp), 'expire_time' (timestamp), 'tags' (array) keys.
	 * 						 false - on error.
	 */
	protected function _read_metadata_file($metadata_file)
	{
		if($metadata = @file_get_contents($metadata_file, false))
		{
			return unserialize($metadata);
		}
		return false;
	}
	
	
	/**
	 * Saves metadata file of given cache entry
	 * @access protected
	 * @param string $metadata_file    A metadata file pathname
	 * @param array $metadata    An array with 'modified_time' (timestamp), 'expire_time' (timestamp), 'tags' (array) keys.
	 * @return boolean|null    TRUE - if metadata has not been written successfully, FALSE - otherwise
	 */
	protected function _save_metadata_file($metadata_file, $metadata)
	{
		return @file_put_contents($metadata_file, serialize($metadata), null);
	}
}

