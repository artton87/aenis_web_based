<?php
/**
 * File max size validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if size of uploaded file is not greater than given value
 * @package Framework\Validate
 */
class App_Validate_File_SizeMax extends App_Validate_Abstract
{
	/**
	 * @var integer    Maximal allowed size of uploaded file
	 */
	protected $_max = null;
	
	
	/**
	 * Constructor. Sets default values.
	 * @param integer|string $max    Maximal allowed file size in bytes
	 * @param string $message    A message to be returned in case of error
	 */
	public function __construct($max = null, $message = null)
	{
		parent::__construct($message);
		$this->setMax($max);
	}
	
	
	/**
     * Sets upper boundary for file size
     * @param integer|string $max    Maximal allowed file size in bytes
     */
	public function setMax($max)
	{
		$this->_max = $max;
	}
	
	/**
     * Return upper boundary for file size
     * @return integer    Maximal allowed file size in bytes
     */
	public function getMax()
	{
		return $this->_max;
	}
	
	/**
	 * Checks if size of uploaded file is smaller than allowed value
	 * @param string $file_key    Key of $_FILES array to be tested
	 * @return boolean
	 */
	public function isValid($file_key)
	{
		$size = intval($_FILES[$file_key]['size']);
        if($this->_max!==null && $size>(int)$this->_max)
        {
            return FALSE;
        }
        return TRUE;
	}
}