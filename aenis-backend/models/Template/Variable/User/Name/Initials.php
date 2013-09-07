<?php
/**
 * Template variable for user name
 * @package aenis
 */


/**
 * Variable for user name initials
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_User_Name_Initials extends Template_Variable_Abstract implements Template_IVariable
{
	/**
	 * Returns notary name with initials.
	 * @param integer $variable_id    Variable ID
	 * @param array $args    Parameters passed for that variable
	 * @param array $data    Optional data which can be used for getting value
	 * @return string
	 */
	public function getVariableValue($variable_id, array $args = array(), array $data = array())
	{
		$user_id = App_Registry::get('temp_sn')->user_id;

		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;

		$oUsers = new Users();
		$result = $oUsers->getUsers(array('user_id'=>$user_id), array($default_lang_id));
		$user_data = $oUsers->db_fetch_array($result);

		return $oUsers->getNameInitials($user_data);
	}
}
