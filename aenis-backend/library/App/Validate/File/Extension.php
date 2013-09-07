<?php
/**
 * File extension validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking extension of uploaded file
 * @package Framework\Validate
 */
class App_Validate_File_Extension extends App_Validate_Abstract
{
	/**
	 * @var array    Array of allowed extensions of uploaded file
	 */
	protected $_extensions = array();
	
	
	/**
	 * Constructor. Sets default values.
	 * @param array $extensions    An array with valid extensions
	 * @param string $message    A message to be returned in case of error
	 */
	public function __construct($extensions = array(), $message = null)
	{
		parent::__construct($message);
		$this->setExtensions($extensions);
	}
	
	
	/**
     * Sets a list of valid extensions
     * @param array $extensions    An array with valid extensions
     */
	public function setExtensions($extensions)
	{
		$this->_extensions = is_array($extensions) ? $extensions : array($extensions);
		foreach($this->_extensions as &$ext)
		{
			$ext = mb_strtolower($ext);
		}
	}
	
	/**
     * Returns list of valid extensions
     * @return array
     */
	public function getExtensions()
	{
		return $this->_extensions;
	}
	
	/**
	 * Checks if uploaded file has an allowed extension
	 * @param string $file_key    Key of $_FILES array to be tested
	 * @return boolean    True - if has, false - otherwise
	 */
	public function isValid($file_key)
	{
		$ext = $_FILES[$file_key]['name'];
        $lastDotPos = mb_strrpos($ext, '.');
        if(FALSE!==$lastDotPos)
        {
			$ext = mb_substr($ext, $lastDotPos+1);
        }
		$ext = mb_strtolower($ext);
		return in_array($ext, $this->_extensions);
	}
}
