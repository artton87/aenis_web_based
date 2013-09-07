<?php
/**
 * Template variable for stock
 * @package aenis
 */


/**
 * Variable for stock
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Stock extends Template_Variable_Abstract_Object implements Template_IVariable
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
			//@TODO set up possible values for Template_Variable_Stock
		);
		return array($arg);
	}
}
