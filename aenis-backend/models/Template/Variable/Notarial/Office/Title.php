<?php
/**
 * Template variable for notarial office title
 * @package aenis
 */


/**
 * Variable for notarial office title
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Notarial_Office_Title extends Template_Variable_Abstract implements Template_IVariable
{
	/**
	 * Returns notarial office title
	 * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
	 * @param array $data    Optional data which can be used for getting value
	 * @return string
	 */
	public function getVariableValue($variable_id, array $args = array(), array $data = array())
	{
		$notarial_office_id = App_Registry::get('temp_sn')->notarial_office_id;
		if(!empty($notarial_office_id))
		{
			$oLanguages = new Languages();
			$default_lang_id = $oLanguages->getDefaultLanguage()->id;

			$oNotarialOffices = new NotarialOffices();
			$result = $oNotarialOffices->getOffices(array('id'=>$notarial_office_id), array($default_lang_id));
			if($row = $oNotarialOffices->db_fetch_array($result))
			{
				return $row['region_title'].', '.$row['community_title'];
			}
		}
		return '';
	}
}
