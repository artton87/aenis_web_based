<?php
/**
 * Datetime format validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if passed date is in valid dd/mm/yyyy format
 * @package Framework\Validate
 */
class App_Validate_DateTime extends App_Validate_Abstract
{
	/**
	 * Checks if passed datetime is in valid dd/mm/yyyy hh:mm:ss format
	 * @access public
	 * @param string $date    Datetime string
	 * @return boolean    true - if datetime is valid, false - otherwise
	 */
	public function isValid($date)
	{
		$nMatches = preg_match('/^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/([1-9][0-9][0-9][0-9])\s+([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/', $date);
		return (0 == $nMatches) ? FALSE : TRUE;
	}
}

