<?php
/**
 * Template variable for transaction properties
 * @package aenis
 */


/**
 * Variable for transaction properties
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Transaction_Property extends Template_Variable_Abstract implements Template_IVariable
{
    /**
     * Returns value of transaction property
     * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
     * @return string
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
		if(isset($args['property']))
		{
			$oProperties = new Transaction_Properties();
			return $oProperties->getProperty($data['transaction_id'], $args['property']);
		}
		return null;
    }


	/**
	 * Returns information about parameters the variable can accept
	 * @return Template_Variable_Argument[]    An array of Template_Variable_Argument type objects
	 */
	public function getParameters()
	{
		$arg = new Template_Variable_Argument;
		$arg->name = 'property';
		$arg->display_name = 'Ատրիբուտի անվանում';
		$oTypes = new Transaction_Property_Types();
		$result = $oTypes->getTypes(array(), false);
		while($row = $oTypes->db_fetch_array($result))
		{
			$arg->values[] = new Template_Variable_Argument_Value($row['id'], $row['label']);
		}
		return array($arg);
	}
}
