<?php
/**
 * Template variable for transaction parties
 * @package aenis
 */


/**
 * Variable for transaction parties
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Transaction_Party extends Template_Variable_Abstract implements Template_IVariable
{
    /**
     * Returns value of transaction party
     * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
     * @return string
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
		$oSubjects = new Transaction_Relationship_Party_Subjects();
		$contact_names = $oSubjects->getSubjectContactNames(
			array(
				'transaction_id' => $data['transaction_id'],
				'party_type_id' => $args['party']
			)
		);
		return implode('<br /><br />', $contact_names);
    }


	/**
	 * Returns information about parameters the variable can accept
	 * @return array    An array of Template_Variable_Argument type objects
	 */
	public function getParameters()
	{
		$arg = new Template_Variable_Argument;
		$arg->name = 'party';
		$arg->display_name = 'Կողմի անվանում';
		$oTypes = new Party_Types();
		$result = $oTypes->getTypes(array(), false);
		while($row = $oTypes->db_fetch_array($result))
		{
			$arg->values[] = new Template_Variable_Argument_Value($row['id'], $row['label']);
		}
		return array($arg);
	}
}
