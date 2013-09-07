<?php
/**
 * Regex validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if passed string matches to given regular expression
 * @package Framework\Validate
 */
class App_Validate_Regex extends App_Validate_Abstract
{
	/**
	 * @var string     String with regular expression as in preg_match
	 */
	protected $_regex = '';
	
	/**
	 * Constructor. Sets default values.
	 * @param string $regex    String with regular expression as in preg_match
	 * @param string $message    A message to be returned in case of error
	 */
	public function __construct($regex = null, $message = null)
	{
		parent::__construct($message);
		$this->setRegex($regex);
	}
	
	/**
     * Sets validator's regular expression
     * @param string $regex    String with regular expression as in preg_match
     */
	public function setRegex($regex)
	{
		$this->_regex = $regex;
	}
	
	/**
     * Return validator's regular expression
     * @return string    String with regular expression as in preg_match
     */
	public function getRegex()
	{
		return $this->_regex;
	}
	
	/**
	 * Checks if passed string matches to given regular expression
	 * @access public
	 * @param string $value    A value to be checked
	 * @return boolean    true - if is integer, false - otherwise
	 */
	public function isValid($value)
	{
		$nMatches = preg_match($this->_regex, $value);
		return (0 == $nMatches) ? FALSE : TRUE;
	}
}

