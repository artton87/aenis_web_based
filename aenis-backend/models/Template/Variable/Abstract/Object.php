<?php
/**
 * Contains code parts common for all object variables
 * @package aenis
 */


/**
 * Abstract class for all object variables
 * @author BestSoft
 * @package aenis\docmgmt
 */
abstract class Template_Variable_Abstract_Object extends Template_Variable_Abstract implements Template_IVariable
{
    /**
     * Returns specific property from value with code='data' or the value itself
     * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
     * @return string|null
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
		$result = null;
		$oObject = new Transaction_Relationship_Objects();
		if(empty($data['object_id']))
		{
            $oTransactionRelationship = new Transaction_Relationships();
            $result = $oTransactionRelationship->getRelationships(array('transaction_id'=>$data['transaction_id']));
            if($row = $this->db_fetch_row($result))
            {
				$result = $oObject->getObjects($row[0], array('data'=>'object_data'));
				if($row = $this->db_fetch_array($result))
				{
					$result = $row['object_data'];
				}
			}
		}
		else
		{
			$result = $oObject->getObjectPropertyValue($data['object_id'], 'data');
            if($row = $this->db_fetch_row($result))
            {
                $result = $row[0];
            }
		}

		if(null !== $result)
		{
			if(isset($args['property']))
			{
				$item  = unserialize($result);
				return $item[$args['property']];
			}
			return $result;
		}
		return null;
    }
}
