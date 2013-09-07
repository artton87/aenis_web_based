<?php
/**
 * Contains code parts common for all variables, which render multiple objects
 * @package aenis
 */


/**
 * Abstract class for all variables, which render multiple objects
 * @author BestSoft
 * @package aenis\docmgmt
 */
abstract class Template_Variable_Abstract_Objects extends Template_Variable_Abstract implements Template_IVariable
{
	/**
	 * The type code of objects, which this variable should render.
	 * Derived classes should set correct values for this.
	 * @var string
	 */
	protected $_object_type_code = null;


    /**
     * Returns vehicle property
     * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
     * @param array $data    Optional data which can be used for getting value
	 * @throws App_Exception if _object_type_code property is not set
     * @return string|null
     */
    public function getVariableValue($variable_id, array $args = array(), array $data = array())
    {
		if(empty($this->_object_type_code))
			throw new App_Exception('_object_type_code property is not set');

		$oVariables = new Template_Variables();
		$variable_info = $oVariables->getById($variable_id);

		$html = '';
        $oTransactionRelationship = new Transaction_Relationships();
        $result = $oTransactionRelationship->getRelationships(array('transaction_id'=>$data['transaction_id']));
        if($row = $this->db_fetch_row($result))
        {
            $oTemplates = new Templates();
            $oObjects = new Transaction_Relationship_Objects();
            $result = $oObjects->getObjects(
                array(
                    'relationship_id' => $row[0],
                    'object_type_code' => $this->_object_type_code
                )
            );
            while($row = $oObjects->db_fetch_array($result))
            {
                $variable_data = array('object_id' => $row['id']);
                $html .= $oTemplates->getHTML($variable_info['content'], $variable_data);
            }
            return $html;
        }
        return null;

    }
}
