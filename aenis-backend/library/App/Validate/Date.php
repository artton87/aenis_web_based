<?php
/**
 * Date format validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if passed date is in valid dd/mm/yyyy format
 * @package Framework\Validate
 */
class App_Validate_Date extends App_Validate_Abstract
{
	/**
	 * Checks if passed date is in valid dd/mm/yyyy format
	 * @access public
	 * @param string $date    Date string
	 * @return boolean    true - if date is valid, false - otherwise
	 */
	public function isValid($date)
	{
		$nMatches = preg_match('/^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/([1-9][0-9][0-9][0-9])$/', $date);
		return (0 == $nMatches) ? FALSE : TRUE;
	}
}

