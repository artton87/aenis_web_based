<?php
/**
 * Template variable for will executor
 * @package aenis
 */


/**
 * Variable for will executor
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Will_Executor extends Template_Variable_Abstract implements Template_IVariable
{
    /**
     * Returns will executor
     * @param integer $variable_id    Variable ID
     * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
     * @return string|null
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
        $oTransactionRelationship = new Transaction_Relationships();
        $result = $oTransactionRelationship->getRelationships(array('transaction_id'=>$data['transaction_id']));
        if($row = $this->db_fetch_row($result))
        {
            $oSubjects = new Transaction_Relationship_Party_Subjects();
            $contact_names = $oSubjects->getSubjectContactNames(
                array(
                    'relationship_id' => $row[0],
                    'party_type_code' => 'executor'
                )
            );
            return implode(',', $contact_names);
        }
        return null;
    }
}
