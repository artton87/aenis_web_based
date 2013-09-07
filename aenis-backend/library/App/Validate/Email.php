<?php
/**
 * Email format validator definition
 * @package Framework\Validate
 */

 
/**
 * Validator for checking if passed email is a valid email address
 * @package Framework\Validate
 */
class App_Validate_Email extends App_Validate_Abstract
{
	/**
	 * Returns TRUE, if given string is a valid email address, FALSE - otherwise
	 * @param string $email
	 * @return boolean
	 */
	public function isValid($email)
	{
		$nMatches = preg_match('/^[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i', $email);
		return (0 == $nMatches) ? FALSE : TRUE;
	}
}

