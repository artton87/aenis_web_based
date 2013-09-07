<?php
/**
 * Date (ISO) format validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if passed date is in valid ISO yyyy-mm-dd format
 * @package Framework\Validate
 */
class App_Validate_IsoDate extends App_Validate_Abstract
{
	/**
	 * Checks if passed date is in valid ISO yyyy-mm-dd format
	 * @access public
	 * @param mixed $date    A date to be checked
	 * @return boolean    true - if date is valid, false - otherwise
	 */
	public function isValid($date)
	{
		$nMatches = preg_match('/^([1-9][0-9][0-9][0-9])-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$/', $date);
		return (0 == $nMatches) ? FALSE : TRUE;
	}
}

