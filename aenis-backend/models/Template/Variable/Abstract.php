<?php
/**
 * Template variable
 * @package aenis
 */


/**
 * Abstract class for all template variables
 * @author BestSoft
 * @package aenis\docmgmt
 */
abstract class Template_Variable_Abstract extends App_Db_Table_Abstract implements Template_IVariable
{
	/**
	 * Returns information about parameters the variable can accept
	 * @return array    An array of Template_Variable_Argument type objects
	 */
	public function getParameters()
	{
		return array();
	}
}
