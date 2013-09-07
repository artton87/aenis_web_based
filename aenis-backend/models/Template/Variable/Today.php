<?php
/**
 * Template variable for today
 * @package aenis
 */


/**
 * Variable for today
 * @author BestSoft
 * @package aenis\workflow
 */
class Template_Variable_Today extends Template_Variable_Abstract implements Template_IVariable
{
    /**
     * Returns value of today
     * @param integer $variable_id    Variable ID
     * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
     * @return string
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
        return date('d F Y');
    }
}
