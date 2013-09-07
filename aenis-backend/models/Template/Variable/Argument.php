<?php
/**
 * Template variable argument
 * @package aenis
 */


/**
 * Describes a single argument which can be passed to template variable
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Argument
{
	/**
	 * Argument name
	 * @var string
	 */
	public $name = '';

	/**
	 * Display name of argument
	 * @var string
	 */
	public $display_name = '';

	/**
	 * Whenever this argument is required
	 * @var boolean
	 */
	public $is_required = true;

	/**
	 * An array of Template_Variable_Argument_Value type objects
	 * @var Template_Variable_Argument_Value[]
	 */
	public $values = array();
}
