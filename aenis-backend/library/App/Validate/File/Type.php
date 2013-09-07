<?php
/**
 * Verifies file type
 * @package Framework\Validate
 */

 
/**
 * Validator for checking whenever file is of a given type
 * @package Framework\Validate
 */
class App_Validate_File_Type extends App_Validate_Abstract
{
	/**
	 * @var array    File type
	 */
	protected $_type = array();


	/**
	 * Constructor. Sets default values.
	 * @access public
	 * @param string $type    File type
	 * @param string $message    A message to be returned in case of error
	 */
	public function __construct($type, $message = null)
	{
		parent::__construct($message);
		$this->setType($type);
	}


	/**
	 * Sets a file type
	 * @access public
	 * @param string $type    File type
	 */
	public function setType($type)
	{
		$this->_type = $type;
	}

	/**
	 * Returns file type
	 * @access public
	 * @return string
	 */
	public function getType()
	{
		return $this->_type;
	}

	/**
	 * Checks if uploaded file has an allowed extension
	 * @access public
	 * @param string $file_key    Key of $_FILES array to be tested
	 * @return boolean    True - if has, false - otherwise
	 */
	public function isValid($file_key)
	{
		return App_File_Utils::check_type($this->_type, $_FILES[$file_key]['tmp_name']);
	}
}
