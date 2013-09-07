<?php
/**
 * Template variable for warrant end date
 * @package aenis
 */


/**
 * Variable for warrant end date
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Warrant_EndDate extends Template_Variable_Abstract implements Template_IVariable
{
	/**
	 * Returns warrant end date
	 * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
	 * @param array $data    Optional data which can be used for getting value
	 * @return string
	 */
	public function getVariableValue($variable_id, array $args = array(), array $data = array())
	{
        $oWarrant = new Warrants();
        return $oWarrant->getWarrantPropertyValue($data['transaction_id'], 'warrant_end_date');
	}
}
