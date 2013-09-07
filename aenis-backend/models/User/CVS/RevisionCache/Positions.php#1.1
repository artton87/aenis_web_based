<?php
/**
 * User positions management
 * @package aenis\Structure
 */

/**
 * Methods for user positions management
 * @author BestSoft
 * @package aenis\Structure
 */
class User_Positions extends App_Db_Table_Abstract
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'staff_user';


	/**
	 * Assigns a user to the given staff position
	 * @access public
	 * @param integer $user_id     User ID
	 * @param integer $staff_id     Staff position ID
	 * @return integer    IF od newly added user-staff pair
	 * @throws App_Db_Exception_Validate if staff position is already occupied by some user
	 * @throws App_Db_Exception_Table if either user ir or staff id is not specified
	 */
	public function assignToPosition($user_id, $staff_id)
	{
		if(empty($user_id))
            throw new App_Db_Exception_Table('User ID is not specified');

        if(empty($staff_id))
            throw new App_Db_Exception_Table('Staff ID is not specified');

		$result = $this->db_select($this->_table, array('id'), array('staff_id'=>$staff_id, 'is_active'=>1));
		if($row = $this->db_fetch_row($result))
			throw new App_Db_Exception_Validate('Հնարավոր չէ օգտվողին նշանակել պաշտոնին, քանի որ պաշտոնը թափուր չէ:');

        $insert_data = array(
			'user_id' => $user_id,
			'staff_id' => $staff_id,
			'is_active' => 1,
			'hire_date' => self::$DB_TIMESTAMP,
			'lu_user_id' => App_Registry::get('temp_sn')->user_id,
			'lu_date' => self::$DB_TIMESTAMP
		);
		$this->db_insert($this->_table, $insert_data);
        $staff_user_id = $this->db_insert_id();
        App_Cache()->refreshTags(array(Staff::CACHE_TAG, Users::CACHE_TAG));
		return $staff_user_id;
	}


	/**
	 * Removes the given user from the given staff
	 * @access public
	 * @param integer $user_id     User ID
	 * @param integer $staff_id     Staff position ID
	 * @return array    An array with updated record fields
	 * @throws App_Db_Exception_Table if staff-user id is not specified
	 */
	public function removeFromPosition($user_id, $staff_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');

		if(empty($staff_id))
			throw new App_Db_Exception_Table('Staff ID is not specified');

		$result = $this->db_select($this->_table, array('id'), array('user_id'=>$user_id, 'staff_id'=>$staff_id, 'is_active'=>1));
		if($row = $this->db_fetch_row($result))
		{
			$staff_user_id = $row[0];
			$update_data = array(
				'is_active' => 0,
				'leaving_date' => self::$DB_TIMESTAMP,
				'lu_user_id' => App_Registry::get('temp_sn')->user_id,
				'lu_date' => self::$DB_TIMESTAMP
			);
			$where = array('id'=>$staff_user_id);
			$this->db_update($this->_table, $update_data, $where);
			App_Cache()->refreshTags(array(Staff::CACHE_TAG, Users::CACHE_TAG));
			$result = $this->db_select($this->_table, array(), $where);
			return $this->db_fetch_array($result);
		}
		return array();
	}


	/**
	 * Returns the list of user positions
	 * @access public
	 * @param integer $user_id    User ID
	 * @throws App_Db_Exception_Table if user id is not specified
	 * @return mysqli_result
	 */
	public function getUserPositions($user_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');
		$q = "
			SELECT
				su.*,
				staff.title AS staff_title,
				dep.id AS dep_id, dep.title AS dep_title
			FROM bs_staff_user su
			JOIN bs_staff staff ON staff.id = su.staff_id
			LEFT JOIN bs_departments dep ON dep.id = staff.dep_id
			WHERE su.user_id = ".intval($user_id)."
			ORDER BY su.is_active DESC, su.id DESC
		";
		return $this->db_query($q);
	}


	/**
	 * Returns the list of users for the given position
	 * @access public
	 * @param integer $staff_id    Staff ID
	 * @throws App_Db_Exception_Table if staff id is not specified
	 * @return mysqli_result
	 */
	public function getPositionUsers($staff_id)
	{
		if(empty($staff_id))
			throw new App_Db_Exception_Table('Staff ID is not specified');

		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;
		$q = "
			SELECT
				su.*,
				uc.first_name, uc.second_name, uc.last_name
			FROM bs_staff_user su
			LEFT JOIN bs_users_content uc ON uc.user_id = su.user_id AND uc.lang_id = $default_lang_id
			WHERE su.staff_id = ".intval($staff_id)."
			ORDER BY su.is_active DESC, su.id DESC
		";
		return $this->db_query($q);
	}


	/**
	 * Returns the list of user staff positions
	 * @access public
	 * @param integer $user_id    User ID
	 * @throws App_Db_Exception_Table if user id is not specified
	 * @return mysqli_result
	 */
	public function getUserStaffs($user_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');
		$q = "
			SELECT 
				staff.id AS staff_id, staff.title AS staff_title, 
				dep.id AS dep_id, dep.title AS dep_title, 
				staff_user.id, 
				staff_user.user_id
			FROM bs_staff AS staff
			JOIN bs_staff_user AS staff_user ON staff_user.staff_id = staff.id
			LEFT JOIN bs_departments AS dep ON dep.id = staff.dep_id
			WHERE staff_user.is_active=1 AND staff_user.user_id = ".intval($user_id);
		return $this->db_query($q);
	}
}
