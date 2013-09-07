<?php
/**
 * Integer validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if passed string is a valid integer
 * @package Framework\Validate
 */
class App_Validate_Int extends App_Validate_Abstract
{
	/**
	 * Checks if passed string is integer number
	 * @access public
	 * @param mixed $value    A value to be checked
	 * @return boolean    true - if is integer, false - otherwise
	 */
	public function isValid($value)
	{
		$nMatches = preg_match('/^[0-9]+$/', $value);
		return (0 == $nMatches) ? FALSE : TRUE;
	}
}

