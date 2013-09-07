<?php
/**
 * File management routines with undo capability
 * @package Framework\File
 */

 
/**
 * Allows to rollback changes done with files, i.e. file moves and copies
 * @package Framework\File
 */
class App_File_Transaction
{
	/**
	 * @var array    Array with transaction actions
	 */
	protected $_transaction = array();
	
	/**
	 * Cached path of directory for temporary files
	 * @static
	 * @var string
	 */
	protected static $_tmp_dir = '';
	
	
	/**
	 * Returns path to the PHP temporary directory
	 * @access public
	 * @static
	 * @return string    Path to the PHP's temp directory
	 */
	public static function getTempDirectory()
	{
		if(empty(self::$_tmp_dir))
		{
			$dir = sha1(time().rand());
			$tmp_file = tempnam($dir, '');
			self::$_tmp_dir = dirname($tmp_file);
			self::$_tmp_dir = rtrim(self::$_tmp_dir, '/\\') . '/';
			@unlink($tmp_file);
		}
		return self::$_tmp_dir;
	}
	
	
	/**
	 * Makes a copy of the file source to destination.
	 * Note. In case of overwriting destination file, existing file will NOT reverted back after rollback.
	 * @access public
	 * @param string $source    Path to the source file
	 * @param string $destination    The destination path
	 * @return boolean    Returns TRUE on success or FALSE on failure
	 */
	public function copyFile($source, $destination)
	{
		$bDestinationExists = @file_exists($destination);
		if($res = @copy($source, $destination))
		{
			$this->_transaction[] = array(
				'action' => 'copy',
				'params' => array('source'=>$source, 'destination'=>$destination, 'destination_exists'=>$bDestinationExists)
			);
		}
		return $res;
	}
	
	
	/**
	 * Moves or renames file from source to destination
	 * @access public
	 * @param string $source    Path to the source file
	 * @param string $destination    The destination path
	 * @return boolean    Returns TRUE on success or FALSE on failure
	 */
	public function moveFile($source, $destination)
	{
		if($res = @rename($source, $destination))
		{
			$this->_transaction[] = array(
				'action' => 'move',
				'params' => array('source'=>$source, 'destination'=>$destination)
			);
		}
		return $res;
	}
	
	
	/**
	 * Deletes the given file
	 * @param string $file_name    Full path to the file to be deleted
	 * @access public
	 * @return boolean
	 */
	public function deleteFile($file_name)
	{
		$tmp_dir = self::getTempDirectory();
		$source = $file_name;
		$destination = $tmp_dir . basename($file_name);
		if($res = @rename($source, $destination))
		{
			$this->_transaction[] = array(
				'action' => 'delete',
				'params' => array('source'=>$source, 'destination'=>$destination)
			);
		}
		return $res;
	}
	
	
	/**
	 * Undo actions done after starting transaction
	 * @access public
	 */
	public function rollback()
	{
		$c = count($this->_transaction);
		for($i=$c-1; $i>=0; --$i)
		{
			$info = $this->_transaction[$i];
			switch($info['action'])
			{
				case 'copy':
					@copy($info['params']['destination'], $info['params']['source']);
					if(!$info['params']['destination_exists'])
						@unlink($info['params']['destination']);
					break;
				case 'move':
					@rename($info['params']['destination'], $info['params']['source']);
					break;
				case 'delete':
					@rename($info['params']['destination'], $info['params']['source']);
					break;
			}
		}
		$this->_transaction = array();
	}
	
	
	/**
	 * Commit actions done after starting transaction
	 * @access public
	 */
	public function commit()
	{
		$c = count($this->_transaction);
		for($i=$c-1; $i>=0; --$i)
		{
			$info = $this->_transaction[$i];
			switch($info['action'])
			{
				case 'delete':
					@unlink($info['params']['destination']);
					break;
			}
		}
		$this->_transaction = array();
	}
}
