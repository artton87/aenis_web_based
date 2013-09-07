<?php
/**
 * Template variable interface
 * @package aenis
 */


/**
 * Interface, which should be implemented by all template variable classes
 * @author BestSoft
 * @package aenis\docmgmt
 */
interface Template_IVariable
{
	/**
	 * Returns value of the given variable using data given.
	 * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
	 * @param array $data    Optional data which can be used for getting value
	 * @return string    Obtained value
	 */
	public function getVariableValue($variable_id, array $args = array(), array $data = array());

	/**
	 * Returns information about parameters the variable can accept
	 * @return Template_Variable_Argument[]    An array of acceptable parameters
	 */
	public function getParameters();
}
