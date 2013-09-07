<?php
/**
 * Abstract filter definition
 * @package Framework\Filter
 */

 
/**
 * An abstract class for all filters
 * @package Framework\Filter
 * @abstract
 */
abstract class App_Filter_Abstract
{
	/**
	 * Applies filter on given $value. File filters receive full file path as $value.
	 * @access public
	 * @param mixed $value    A value to be filtered
	 */
	abstract public function applyFilter($value);
}