<?php
/**
 * Uploaded files handling routines
 * @package Framework\File
 */

 
/**
 * Handles relocation and reception of uploaded files
 * @package Framework\File
 */
class App_File_Transfer_Info
{
	/**
	 * Final name of transferred file
	 * @var string
	 */
	public $name = '';

	/**
	 * Final path of transferred file, relative to storage location
	 * @var string
	 */
	public $path = '';

	/**
	 * Final full absolute path of transferred file, including file name
	 * @var string
	 */
	public $full_file_path = '';

	/**
	 * Storage location, where file has been placed
	 * @var App_File_Storage_Location
	 */
	public $location = null;

	/**
	 * Key of file, which has been transferred
	 * @var string
	 */
	public $key = '';


	/**
	 * Constructor. Sets values for class properties.
	 * @access public
	 * @param string $name    Final name of transferred file
	 * @param string $path    Final path of transferred file, relative to storage location
	 * @param string $full_file_path    Final full absolute path of transferred file, including file name
	 * @param App_File_Storage_Location $location    Storage location, where file has been placed
	 * @param string $key    Key of file, which has been transferred
	 */
	public function __construct($name, $path, $full_file_path, $location, $key)
	{
		$this->name = $name;
		$this->path = $path;
		$this->full_file_path = $full_file_path;
		$this->location = $location;
		$this->key = $key;
	}
}
