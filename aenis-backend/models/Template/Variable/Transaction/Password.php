<?php
/**
 * Template variable for transaction password
 * @package aenis
 */


/**
 * Variable for transaction code
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Transaction_Password extends Template_Variable_Abstract implements Template_IVariable
{
    /**
     * Returns transaction password
     * @param integer $variable_id    Variable ID
     * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
     * @return string
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
        $oWarrant = new Warrants();
        return $oWarrant->getWarrantPropertyValue($data['transaction_id'], 'transaction_password');
    }
}
