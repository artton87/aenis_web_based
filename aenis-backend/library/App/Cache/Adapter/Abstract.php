<?php
/**
 * Abstract cache adapter definition
 * @package Framework\Cache
 */

 
/**
 * An abstract class for all cache adapters
 * @package Framework\Cache
 */
abstract class App_Cache_Adapter_Abstract
{
	/**
	 * Append given data to cache
	 * @abstract
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param string $data    A string data to be cached
	 * @param integer $lifetime     Optional lifetime for that cache record in seconds.
	 * 							    Value of NULL means cache will not expire and remain 'forever'.
	 * @param array $tags    Optional. An array of tags for that cache entry.
	 * @param boolean $serialize    Optional. If given, will serialize data before caching
	 */
	abstract public function set($id, $data, $lifetime = null, array $tags = array(), $serialize = false);
	
	
	/**
	 * Returns given cache entry
	 * @abstract
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param boolean $skip_valid_check    Optional. Whenever to check for valid cache entry before reading it
	 * @param boolean $unserialize    Optional. Whenever to unserialize cached data before returning it
	 * @return string|boolean    Cached data if any, FALSE - of cache does not exist
	 */
	abstract public function get($id, $skip_valid_check = false, $unserialize = false);
	
	
	/**
	 * Remove given cache entry
	 * @abstract
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 */
	abstract public function remove($id);
	
	
	/**
	 * Check if the given entry exists in cache
	 * @abstract
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @return boolean    TRUE - if entry with given id is cached, FALSE - otherwise
	 */
	abstract public function isCached($id);

	
	/**
	 * Clean expired cached data and metadata
	 * @abstract
	 * @access public
	 */
	abstract public function clean();
	
	
	/**
	 * Purge all cached data and metadata
	 * @abstract
	 * @access public
	 */
	abstract public function purge();
	
	
	/**
	 * Tag the given cache entry
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param array|string $tags    Tag(s) to use
	 */
	public function appendTags($id, $tags) {}
	
	
	/**
	 * Removes tag(s) from the given cache entry
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @param array|string $tags    Tag(s) to remove
	 */
	public function removeTags($id, $tags) {}
	
	
	/**
	 * Refresh all cache entries tagged with the given tag(s)
	 * @access public
	 * @param array|string $tags    Tag(s) to refresh
	 */
	public function refreshTags($tags) {}


	/**
	 * Magic implementation of get() method with all default parameters
	 * @access public
	 * @param string $id    Cache entry id
	 * @return mixed    Cached data or false - if cached data does not exist
	 */
	public function __get($id)
	{
		return $this->get($id);
	}


	/**
	 * Magic implementation of set() method with all default parameters
	 * @access public
	 * @param string $id    Cache entry id
	 * @param string $data    A string data to be cached
	 */
	public function __set($id, $data)
	{
		return $this->set($id, $data);
	}


	/**
	 * Magic method to check if the given entry exists in cache
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 * @return boolean    FALSE - if cache is not available, TRUE - otherwise
	 */
	public function __isset($id)
	{
		return $this->isCached($id) ? true : false;
	}


	/**
	 * Magic method to completely remove given entry from cache
	 * @access public
	 * @param string $id    Unique id, which identifies the cache entry
	 */
	public function __unset($id)
	{
		return $this->remove($id);
	}

	
	/**
     * Determine system TMP directory and detect if we have read access
     * @access public
     * @static
     * @return string
     * @throws App_Cache_Adapter_Exception if unable to determine directory
     */
    public static function getTmpDir()
    {
        foreach (array($_ENV, $_SERVER) as $tab)
        {
            foreach (array('TMPDIR', 'TEMP', 'TMP', 'windir', 'SystemRoot') as $key)
            {
                if (isset($tab[$key])) 
                {
                    if (($key == 'windir') or ($key == 'SystemRoot')) 
                    {
                        $dir = realpath($tab[$key] . '\\temp');
                    }
                    else 
                    {
                        $dir = realpath($tab[$key]);
                    }
                    if(self::_is_good_tmp_dir($dir)) return $dir;
                }
            }
        }

        if ($upload = ini_get('upload_tmp_dir')) 
        {
            $dir = realpath($upload);
            if (self::_is_good_tmp_dir($dir)) {
                return $dir;
            }
        }
        
        if (function_exists('sys_get_temp_dir'))
        {
            $dir = sys_get_temp_dir();
            if(self::_is_good_tmp_dir($dir)) return $dir;
        }
        
        // Attempt to detect by creating a temporary file
        $tempFile = tempnam(md5(uniqid(rand(), TRUE)), '');
        if ($tempFile)
        {
            $dir = realpath(dirname($tempFile));
            unlink($tempFile);
            if(self::_is_good_tmp_dir($dir)) return $dir;
        }
        if(self::_is_good_tmp_dir('/tmp')) return '/tmp';
        
        if(self::_is_good_tmp_dir('\\temp')) return '\\temp';
        
        throw new App_Cache_Adapter_Exception('Could not determine temp directory, please specify a cache_dir manually');
    }
	
	
	/**
	 * Returns true if given path points to readable and writable directory
	 * @access protected
	 * @static
	 * @param string $path    A path to be tested
	 * @return boolean
	 */
	protected static function _is_good_tmp_dir($path)
	{
		return (is_dir($path) && is_readable($path) && is_writable($path));
	}
}
