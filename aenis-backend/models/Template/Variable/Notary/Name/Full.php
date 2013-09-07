<?php
/**
 * Template variable for notary name
 * @package aenis
 */


/**
 * Variable for full notary name
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Notary_Name_Full extends Template_Variable_Abstract implements Template_IVariable
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
		$oUsers = new Users();
		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;

		$notary_user_id = 0;
		if(empty($data['transaction_id']))
		{
			$user_id = App_Registry::get('temp_sn')->user_id;

			$row = $oUsers->getUserNotary($user_id, $default_lang_id);
			if(empty($row)) //there are multiple notaries found
			{
				return null; //return nothing, user should care about selecting which notary is needed
			}
			$notary_user_id = $row['id'];
		}
		else
		{
			$oTransactions = new Transactions();
			$notary_user_id = $oTransactions->getTransactionNotary($data['transaction_id']);
		}

		if(0 !== $notary_user_id)
		{
			$result = $this->db_query(
				"SELECT getUserFullName($notary_user_id, $default_lang_id) FROM dual"
			);
			if($row = $this->db_fetch_row($result))
			{
				return $row[0];
			}
		}
		return null;
	}
}
