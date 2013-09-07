<?php
/**
 * Uploaded files handling routines
 * @package Framework\File
 */

 
/**
 * Handles relocation and reception of uploaded files
 * @package Framework\File
 */
class App_File_Transfer
{
	/**
	 * @static
	 * @var App_File_Storage_Manager    Storage manager
	 */
	protected static $_storage_manager = null;

	/**
	 * @static
	 * @var integer    The incremental index of transferred file
	 */
	protected static $_transfer_index = 0;

    /**
	 * @var App_Sequence_Validators    Validator sequence for uploaded files
	 */
    protected $_validatorSequence = null;
    
    /**
	 * @var App_Sequence_Filters    Filter sequence for uploaded files
	 */
    protected $_filterSequence = null;
    
	/**
	 * Information about handled uploaded files
	 * @var App_File_Transfer_Info[]
	 */
	protected $_transferredFiles = array();


	/**
	 * Sets storage manager
	 * @access public
	 * @static
	 * @param App_File_Storage_Manager $storage_manager    Storage manager
	 */
	public static function setStorageManager($storage_manager)
	{
		self::$_storage_manager = $storage_manager;
	}


	/**
	 * Returns storage manager
	 * @access public
	 * @static
	 * @return App_File_Storage_Manager    Storage manager
	 */
	public static function getStorageManager()
	{
		return self::$_storage_manager;
	}


	/**
	 * Assigns validators sequence for this file transfer
	 * @access public
	 * @param App_Sequence_Validators $validators    Validator sequence
	 */
	public function setValidatorSequence($validators)
	{
		$this->_validatorSequence = $validators;
	}
    
    /**
	 * Returns validators sequence of this file transfer
	 * @access public
	 * @return App_Sequence_Validators    Validator sequence
	 */
    public function getValidatorSequence()
    {
		return $this->_validatorSequence;
    }
    
    
    
    /**
	 * Assigns filter sequence for this file transfer
	 * @access public
	 * @param App_Sequence_Filters $filters    Filter sequence
	 */
	public function setFilterSequence($filters)
	{
		$this->_filterSequence = $filters;
	}
    
    /**
	 * Returns filter sequence of this file transfer
	 * @access public
	 * @return App_Sequence_Filters    Filter sequence
	 */
    public function getFilterSequence()
    {
		return $this->_filterSequence;
    }
	
	
	
	/**
	 * A constructor. Starts new file transfer operation
	 * @access public
	 */
	public function __construct()
	{
		$this->resetTransfer();
	}
	
	
	/**
	 * Resets file transfer object
	 * @access public
	 */
	public function resetTransfer()
	{
		$this->_transferredFiles = array();
	}
	
    
	
	/**
	 * Transfers given files to their locations
	 * @access public
	 * @param array $file_keys    Array with keys from $_FILES array
	 * @param string $path    A subdirectory to be used as destination
	 * @param string $prefix    Optional. A prefix to be prepended to file names.
	 * @param boolean $direct    Optional. If true, $path denotes direct path
	 * @param array|null $created_dir_perms    Optional. If not null, transfer() will create missing $path
	 * 					 and chmod it to $created_dir_perms['mask'] and chown it to $created_dir_perms['owner'].
	 * 					 Omitting 'mask'/'owner' key will create directory with default permissions/owner
	 * @throws App_Exception if errors happen during file transfer
	 * @throws App_Exception_Validate if some of file validators fails
	 */
	public function transfer(array $file_keys, $path, $prefix='', $direct=false, $created_dir_perms=null)
	{
		if(!empty($path))
		{
			$path = trim($path, '/\\');
			$path = $path.'/';
		}
		if($direct && empty($path))
			throw new App_Exception('Path should be a full path to directory in direct=true mode');

		$stamp = substr(str_replace('.', '', microtime(true)), 2);
		
		foreach($file_keys as $file_key)
		{
			if(is_array($_FILES[$file_key]['name']))
				throw new App_Exception('File upload with xxx[] syntax is not supported. Use different names for all input[type="file"] elements.');
			
			//check file against validators if any
			if(null !== $this->_validatorSequence)
			{
				if(FALSE === $this->_validatorSequence->run($file_key))
					throw new App_Exception_Validate($this->_validatorSequence->getFailureMessage());
			}
			
			//get file size
			$file_size = intval($_FILES[$file_key]['size']);

			$target = null;
			if($direct)
			{
				$location = new App_File_Storage_Location(0, $path);
				if($location->isWritable() && $location->canHold($file_size))
				{
					$target = $location->getPath(true);
				}
				else throw new App_Exception(
					'Given path '.$path." is not writable or does not have {$file_size}B free space"
				);
			}
			else
			{
				$storageManager = self::getStorageManager();
				if(null !== ($location = $storageManager->getStorageByFileSize($file_size)))
				{
					$target = $location->getPath(true);
				}
			}

			//if not in direct mode, append $path as subdirectory
			if(!$direct && null!==$target)
			{
				if(!file_exists($target.$path) && null !== $created_dir_perms)
				{
					@mkdir($target.$path, isset($created_dir_perms['mask']) ? $created_dir_perms['mask'] : 0777, true);
					if(isset($created_dir_perms['owner']))
						@chown($target.$path, $created_dir_perms['owner']);
				}
				if(!file_exists($target.$path) || !is_writable($target.$path))
					throw new App_Exception(
						"Storage $target exits and is writable, but its $path subdirectory is not writable or does not exist"
					);
				$target = $target.$path;
			}

			//build safe filename
			$filename = $_FILES[$file_key]['name'];
			$filename = preg_replace('/((%[\\dA-Fa-f][\\dA-Fa-f])|\\+)+/', '_', rawurlencode($filename));
			$filename = str_replace(array('$', "'", '!', '*', '?', '"', '<', '>', '/', '\\', ':'), '', $filename);
			$filename = (empty($prefix) ? '' : $prefix.'_').$stamp.(++self::$_transfer_index).'_'.$filename;

			//try to move the file to target directory and throw critical exception on error
			if(FALSE === @move_uploaded_file($_FILES[$file_key]['tmp_name'], $target.$filename))
				throw new App_Exception("Error during moving uploaded file to directory $target with filename $filename");
		        
		    //run filters on file if any
			if(null !== $this->_filterSequence)
			{
				$filename = $this->_filterSequence->run($target.$filename);
				$filename = basename($filename); //strip path part, leaving only filename
			}
				
			//append transferred file path and name to rollback array
			$this->_transferredFiles[] = new App_File_Transfer_Info(
				$filename, $path, $target.$filename, $location, $file_key
			);
		}
	}
	
	
	/**
	 * Returns array with information about transferred files
	 * @access public
	 * @return App_File_Transfer_Info[]
	 */
	public function getTransferredFiles()
	{
		return $this->_transferredFiles;
	}
	
	
	/**
     * Removes files, previously placed with transfer method.
     */
    public function rollbackTransfer()
    {
        foreach($this->_transferredFiles as $file)
        {
        	@unlink($file['path'].$file['name']);
		}
        $this->resetTransfer();
    }
}
