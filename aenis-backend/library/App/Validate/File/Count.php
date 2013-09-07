<?php
/**
 * File count validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking number of uploaded file
 * @package Framework\Validate
 */
class App_Validate_File_Count extends App_Validate_Abstract
{
	/**
	 * @var integer    Maximal allowed count of uploaded files
	 */
	protected $_allowed_count = 0;
	
	
	/**
	 * Constructor. Sets default values.
	 * @param integer|string $count    Maximal allowed count of uploaded files
	 * @param string $message    A message to be returned in case of error
	 */
	public function __construct($count = null, $message = null)
	{
		parent::__construct($message);
		$this->setAllowedCount($count);
	}
	
	/**
     * Sets allowed count of uploaded files
     * @param integer|string $count    Maximal allowed count of uploaded files
     */
	public function setAllowedCount($count)
	{
		$this->_allowed_count = $count;
	}
	
	/**
     * Return allowed count of uploaded files
     * @return integer    Maximal allowed count of uploaded files
     */
	public function getAllowedCount()
	{
		return $this->_allowed_count;
	}
	
	/**
	 * Checks if count of uploaded files in valid
	 * @param mixed $dummy    Not used in this method
	 * @return boolean    True - if value is valid, false - otherwise
	 */
	public function isValid($dummy)
	{
		return (count($_FILES)>$this->_allowed_count) ? FALSE : TRUE;
	}
}