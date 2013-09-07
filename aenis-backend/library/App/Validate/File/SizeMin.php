<?php
/**
 * File min size validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if size of uploaded file is not smaller than given value
 * @package Framework\Validate
 */
class App_Validate_File_SizeMin extends App_Validate_Abstract
{
	/**
	 * @var integer    Minimal allowed size of uploaded file
	 */
	protected $_min = null;
	
	/**
	 * Constructor. Sets default values.
	 * @param integer|string $min    Minimal allowed file size in bytes
	 * @param string $message    A message to be returned in case of error
	 */
	public function __construct($min = null, $message = null)
	{
		parent::__construct($message);
		$this->setMin($min);
	}
	
	/**
     * Sets lower boundary for file size
     * @param integer|string $min    Minimal allowed file size in bytes
     */
	public function setMin($min)
	{
		$this->_min = $min;
	}
	
	/**
     * Return lower boundary for file size
     * @return integer    Minimal allowed file size in bytes
     */
	public function getMin()
	{
		return $this->_min;
	}
	
	/**
	 * Checks if size of uploaded file is greater than allowed value
	 * @param string $file_key    Key of $_FILES array to be tested
	 * @return boolean
	 */
	public function isValid($file_key)
	{
		$size = intval($_FILES[$file_key]['size']);
        if($this->_min!==null && $size<(int)$this->_min)
        {
            return FALSE;
        }
        return TRUE;
	}
}
