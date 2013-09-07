<?php
/**
 * Logging into database tables
 * @package Core\Logging
 */

/**
 * Table log handling methods
 * @author BestSoft
 * @package Core\Logging
 */
class Transactions_Log extends App_Db_Table_Abstract
{

	/**
     * Creates new entry in transaction_log.
     * After that items can be added to that entry using log_new_entry method
     * @access public
     * @param array $tr_id_list    Transaction type id list
     * @param array $search_params   Parameters to be recorded
     * @return integer    ID of log entry
     */
	public function logInsert($tr_id_list, $search_params)
	{
		$user_id = App_Registry::get('temp_sn')->user_id;
		if(empty($user_id))
			$user_id = self::$DB_NULL;
		$this->db_insert(
			'transaction_log',
			array(
	            'tr_id_list' => ($tr_id_list) ? implode(',', $tr_id_list) : '',
	            'search_params' => App_Json::encode($search_params),
				'lu_user_ip' => getenv('REMOTE_ADDR'),
	            'lu_user_id' => $user_id,
	            'lu_date' => self::$DB_TIMESTAMP
	        )
        );
        
        return $this->db_insert_id();
	}
	
}