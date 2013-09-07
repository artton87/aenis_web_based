<?php
/**
 * Template variable for notary name
 * @package aenis
 */


/**
 * Variable for notary name initials
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Notary_Name_Initials extends Template_Variable_Abstract implements Template_IVariable
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
		$oUsers = new Users();
		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;

		$user_data = array();
		if(empty($data['transaction_id']))
		{
			$user_id = App_Registry::get('temp_sn')->user_id;

			$user_data = $oUsers->getUserNotary($user_id, $default_lang_id);
			if(empty($user_data)) //there are multiple notaries found
			{
				return null; //return nothing, user should care about selecting which notary is needed
			}
		}
		else
		{
			$oTransactions = new Transactions();
			$notary_user_id = $oTransactions->getTransactionNotary($data['transaction_id']);
			if($notary_user_id > 0)
			{
				$result = $oUsers->getUsers(array('user_id'=>$notary_user_id), array($default_lang_id));
				$user_data = $oUsers->db_fetch_array($result);
			}
		}

		if(!empty($user_data))
			return $oUsers->getNameInitials($user_data);

		return null;
	}
}
