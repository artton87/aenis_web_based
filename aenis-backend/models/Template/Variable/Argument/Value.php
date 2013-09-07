<?php
/**
 * Template variable argument value
 * @package aenis
 */


/**
 * Describes a single value which can be used as value for template variable argument
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Argument_Value
{
	/**
	 * A value
	 * @var string
	 */
	public $value = '';

	/**
	 * Display name of value
	 * @var string
	 */
	public $display_name = '';


	/**
	 * @param string $value    A value
	 * @param string $display_name    Display name of value
	 */
	public function __construct($value = '', $display_name = '')
	{
		$this->value = $value;
		$this->display_name = $display_name;
	}
}
