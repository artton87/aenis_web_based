<?php
/**
 * Cases management
 * @package aenis
 */

/**
 * Methods for working with cases
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Cases extends App_Db_Table_Abstract
{

	public function getCases($params, $start = 0, $limit = 0, $returnCount=false){
		$join = array();
		$where = array();
        
		//if (!$params) throw new App_Db_Exception_Table('Case search called without parameters');

		if ($params['notary_user_id']){
			$where[] = 'notary_user_id = '.intval($params['notary_user_id']);
		}
		if (isset($params['is_all_scanned'])){
			$where[] = 'is_all_scanned = '.intval($params['is_all_scanned']);
		}
		if ($params['case_code']){
			$where[] = 'case_code = '.intval($params['case_code']);
		}


		if(!Acl()->allowed('case.show_all_cases'))
		{
			//$oStaff = new Staff();
			//$staff_user_sub_select = $oStaff->getStaffsDescendantUsersQuery(App_Registry::get('temp_sn')->user_staffs);

			$notary_cases_see_condition = 'notary_user_id IS NULL';
			if(Acl()->allowed('case.show_notary_cases'))
			{
				$user_id = App_Registry::get('temp_sn')->user_id;
				$result = $this->db_query("SELECT getUserNotaries($user_id, NULL) FROM dual");
				if(($row = $this->db_fetch_row($result)) && !empty($row[0]))
				{
					$notary_cases_see_condition .= ' OR (notary_user_id IN ('.$row[0].'))';
				}
			}

			//show transactions of child staff users, his own, and, optionally of his notary
			$where[] = "(
				$notary_cases_see_condition
			)";
		}


		$where = empty($where) ? '' : 'WHERE '.implode(' AND ', array_unique($where));
		$join = (count($join) > 0) ? implode(' ', array_unique($join)) : '';

		if($returnCount)
		{
			$query = "SELECT count(id)
						FROM bs_cases
						$join
						$where
						";
			$result = $this->db_query($query);
			if($row = $this->db_fetch_row($result))
			{
				return intval($row[0]);
			}
			return 0;
		}
		else
		{
			$limit = intval($limit);
			$start = intval($start);
			$limit = (intval($limit) > 0) ? "LIMIT $start, $limit" : '';

			$query = "SELECT id, case_code, is_all_scanned
						FROM bs_cases
						$join
						$where
						ORDER BY id
						$limit
						";

			return $this->db_query($query);
		}
	}

	/**
	 * Add new case
	 * @param array $data     Associative array with 'cases' database table field values
	 * @return integer    Id of newly inserted record
	 */
	public function addCase($data)
	{
		$this->db_insert('cases', array(
			'notary_user_id' => empty($data['notary_user_id']) ? self::$DB_NULL : $data['notary_user_id'],
			'input_user_id' => $data['input_user_id'],
			'creation_date' => self::$DB_TIMESTAMP
		));
		return $this->db_insert_id();
	}

	/**
	 * Update a case
	 * @param array $data     Associative array with 'cases' database table field values
	 * @return integer    Id of newly inserted record
	 */
	public function updateCase($data)
	{
		//print_r($data); exit;
		$this->db_update(
			'cases',
			array('is_all_scanned' => $data['is_all_scanned']),
			array('id' => $data['id'])
		);
		//return $this->db_insert_id();
	}
}
