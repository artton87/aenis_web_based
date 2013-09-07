<?php
/**
 * @author Best Soft
 * @package eNotry
 */

 
/**
 * Կայքի օգտվողների նախասիրությունների հետ աշխատանքի ֆունկցիաներ
 * @package eNotry
 */
class Customer_Preferences extends App_Db_Table_Abstract
{
	const NOTARY_VIEW_MODE_STANDARD = 'standard';
    const NOTARY_VIEW_MODE_EXTENDED = 'extended';
	
	/**
	 * Ավելացնել նոր նախասիրություն
	 * @access public
	 * @param array $data    Ասոցիատիվ զանգված customer_preferences աղյուսակի տվյալներով
	 * @throws App_Db_Exception_Validate
	 */
	public function addPreferences($preferences)
	{
		$dba = $this->getAdapter();
		
		$result = $this->getActualPreferences($preferences['customer_id']);
		
		if($row = $dba->fetch_array($result))
		{
			$this->updatePreferences($preferences);
		}
		else
		{
			$dba->insert('customer_preferences', $preferences);
		}
		
	}
	
	/**
	 * Խմբագրել օգտվողի նախասիրություննները
	 * @access public
	 * @param array $data    Ասոցիատիվ զանգված customer_preferences աղյուսակի տվյալներով
	 * @throws App_Db_Exception_Validate
	 */
	public function updatePreferences($preferences)
	{
		$dba = $this->getAdapter();
		
		$preferences['last_updated'] = self::$DB_TIMESTAMP;
		$dba->update('customer_preferences', $preferences,
				array(
					'customer_id' => intval($preferences['customer_id'])					
				)
		);
	}
	
	/**
	 * Վերադարձնում է օգտվողի նախասիրությունները
	 * @access public
	 * @return mysqli_result
	 */
	public function getActualPreferences($customer_id)
	{
		
		$dba = $this->getAdapter($search = array());
		
		$q = "
			SELECT notary_view_mode			
			FROM bs_customer_preferences
			WHERE customer_id = ".intval($customer_id)."
			LIMIT 1
		";
		
		return $dba->query($q);
	}
	
}
