<?php
/**
 * Filter sequence definition
 * @package Framework\Sequence
 */
 
/**
 * A sequence class for filters. Hold one or more filters, derived from App_Filter_Abstract
 * @package Framework\Sequence
 */
class App_Sequence_Filters extends App_Sequence_Abstract
{
    /**
     * Runs filters on given value
     * @access public
     * @param mixed $value    Value to be filtered
     * @return mixed    Filtered value
     */
    public function run($value)
    {
		foreach($this->_items as $filter)
		{
			$value = $filter->applyFilter($value);
		}
		return $value;
    }
}
