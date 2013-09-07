<?php
/**
 * Empty string validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if passed string is not empty
 * @package Framework\Validate
 */
class App_Validate_NonEmpty extends App_Validate_Abstract
{
	/**
	 * Checks if passed string is not empty
	 * @access public
	 * @param string $value    A value to be checked
	 * @return boolean    true - if is non empty, false - otherwise
	 */
	public function isValid($value)
	{
		$value = trim($value);
		return empty($value) ? FALSE : TRUE;
	}
}

