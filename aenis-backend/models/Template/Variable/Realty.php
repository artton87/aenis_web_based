<?php
/**
 * Template variable for realty
 * @package aenis
 */


/**
 * Variable for realty
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Realty extends Template_Variable_Abstract_Object implements Template_IVariable
{
	/**
	 * Returns information about parameters the variable can accept
	 * @return array    An array of Template_Variable_Argument type objects
	 */
	public function getParameters()
	{
		$arg = new Template_Variable_Argument;
		$arg->name = 'property';
		$arg->display_name = 'Տվյալի անվանում';
		$arg->is_required = true;
		$arg->values = array(
			new Template_Variable_Argument_Value('address', 'հասցե')
			//@TODO add other variable values to Template_Variable_Realty
		);
		return array($arg);
	}
}
