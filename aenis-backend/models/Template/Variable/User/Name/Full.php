<?php
/**
 * Template variable for user name
 * @package aenis
 */


/**
 * Variable for full user name
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_User_Name_Full extends Template_Variable_Abstract implements Template_IVariable
{
	/**
	 * Returns full notary name.
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

		$result = $this->db_query(
			"SELECT getUserFullName($user_id, $default_lang_id) FROM dual"
		);
		if($row = $this->db_fetch_row($result))
		{
			return $row[0];
		}
		return '';
	}
}
