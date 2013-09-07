<?php
/**
 * Validator sequence definition
 * @package Framework\Sequence
 */

 
/**
 * A sequence class for validators. Hold one or more filters, derived from App_Validate_Abstract
 * @package Framework\Sequence
 */
class App_Sequence_Validators extends App_Sequence_Abstract
{
    /**
     * @var integer    Index of failed validator
     */
    protected $_failed_index = null;
    
    
    /**
     * Return failure message if any
     * @access public
     * @return string    Failure message is some validator has failed
     */
    public function getFailureMessage()
    {
		if(null !== $this->_failed_index)
			return $this->_items[$this->_failed_index]->getFailureMessage();
		return '';
    }
    
    
    /**
     * Tests given value against all validators in sequence
     * @access public
     * @param mixed $value    Value to be tested
     * @return boolean    TRUE - if all validators passed, FALSE - otherwise
     */
    public function run($value)
    {
    	$this->_failed_index = null;
		foreach($this->_items as $index=>$validator)
		{
			if(FALSE === $validator->isValid($value))
			{
				$this->_failed_index = $index;
				return FALSE;
			}
		}
		return TRUE;
    }
}
