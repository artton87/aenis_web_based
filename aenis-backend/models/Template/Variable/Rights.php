<?php
/**
 * Template variable for warrant agent
 * @package aenis
 */


/**
 * Variable for warrant agent
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Rights extends Template_Variable_Abstract implements Template_IVariable
{
    /**
     * Returns warrant agent
     * @param integer $variable_id    Variable ID
     * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
     * @return string
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
		if(!empty($data['relationship_id']))
		{
			$party_rights = array();
			$o = new Transaction_Relationship_Parties();
			$result = $o->getParties(array('relationship_id'=>$data['relationship_id'], 'party_type_code'=>'agent'));
			while($row = $o->db_fetch_array($result))
			{
				$party_id = $row['party_id'];
				$oPartyRights = new Transaction_Relationship_Party_Rights();
				$party_rights_result = $oPartyRights->getPartyRights(array('party_id'=>$party_id));
				while($party_rights_row = $this->db_fetch_array($party_rights_result))
				{
					$party_rights[] = $party_rights_row['party_right_type_label'];
				}
			}
			return implode(',', $party_rights);
		}
        return null;
    }
}
