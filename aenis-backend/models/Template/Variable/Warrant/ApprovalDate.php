<?php
/**
 * Template variable for warrant approval date
 * @package aenis
 */


/**
 * Variable for warrant approval date
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Warrant_ApprovalDate extends Template_Variable_Abstract implements Template_IVariable
{
	/**
	 * Returns warrant approval date
	 * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
	 * @param array $data    Optional data which can be used for getting value
	 * @return string
	 */
	public function getVariableValue($variable_id, array $args = array(), array $data = array())
	{
		return date('d/m/Y');
	}
}
