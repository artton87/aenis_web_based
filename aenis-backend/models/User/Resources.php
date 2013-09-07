<?php
/**
 * Allowed resources for the given user
 * @package aenis\Permissions
 */

/**
 * Methods for working with allowed resources for the given user
 * @author BestSoft
 * @package aenis\Permissions
 */
class User_Resources extends App_Db_Table_Abstract
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'user_resources';


	/**
	 * Returns query for selecting resources, which
	 * are allowed to the given user from his role(s)
	 * @access protected
	 * @param integer $user_id    User ID
	 * @return string
	 */
	protected function getUserRoleResourcesQuery($user_id)
	{
		return "(
				SELECT
					res.id AS resource_id
				FROM bs_resources res
				JOIN bs_role_allowed_resources role_res ON role_res.resource_id = res.id
				JOIN bs_staff_roles staff_roles ON staff_roles.role_id = role_res.role_id
				JOIN bs_staff_user staff_user ON staff_user.staff_id = staff_roles.staff_id
				WHERE staff_user.user_id = $user_id AND staff_user.is_active = 1
					AND res.id NOT IN (
						SELECT
							user_res.resource_id
						FROM bs_user_resources user_res
						WHERE user_res.user_id = $user_id AND user_res.flag = 'subtract'
					)
			)
			UNION
			(
				SELECT
					user_res.resource_id
				FROM bs_user_resources user_res
				WHERE user_res.user_id = $user_id AND user_res.flag = 'append'
			)
		";
	}


	/**
	 * Returns list of all resources with flag, which shows if resource is allowed for the given user
	 * @access public
	 * @param integer $user_id    User ID
	 * @param boolean $include_root_resources    Optional. Whenever to include resources, which only root can see
	 * @return mysqli_result|resource
	 * @throws App_Db_Exception_Table if role id is not specified
	 */
	public function getResources($user_id, $include_root_resources = false)
	{
		$include_root_resources_condition = $include_root_resources ? '' : 'WHERE res.is_root_resource=0';
		$user_id = intval($user_id);
		$q = "SELECT
				res.id AS resource_id, res.title, res.code,
				IFNULL(user_allowed_res.resource_id, 0) AS user_allowed_res_id
			FROM bs_resources res
			LEFT JOIN (
				".$this->getUserRoleResourcesQuery($user_id)."
			) user_allowed_res ON user_allowed_res.resource_id = res.id
			$include_root_resources_condition
			ORDER BY res.title ASC, res.code ASC
		";
		return $this->db_query($q);
	}


	/**
	 * Returns list of allowed resources for the given user from database
	 * @access public
	 * @param integer $user_id    User ID
	 * @throws App_Db_Exception_Table if user id is not specified
	 * @return mysqli_result|resource
	 */
	public function getAllowedResources($user_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');

		$result = $this->db_select('users', array('is_root'), array('id'=>$user_id));
		if(($row = $this->db_fetch_row($result)) && $row[0]==1)
		{
			//root user has all available permissions to all available resources
			$q = "SELECT id, code FROM bs_resources";
		}
		else
		{
			$user_id = intval($user_id);
			$q = "SELECT
					res.id, res.code
				FROM (
					".$this->getUserRoleResourcesQuery($user_id)."
				) user_allowed_res
				JOIN bs_resources res ON res.id = user_allowed_res.resource_id
			";
		}
		return $this->db_query($q);
	}


	/**
	 * Returns list of allowed resources for the given web service client from database
	 * @access public
	 * @param integer $user_id    User ID
	 * @throws App_Db_Exception_Table if user id is not specified
	 * @return mysqli_result|resource
	 */
	public function getWebServiceClientAllowedResources($user_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');

		$user_id = intval($user_id);
		$q = "SELECT
				res.id, res.code
			FROM bs_user_resources user_allowed_res
			JOIN bs_resources res ON res.id = user_allowed_res.resource_id
			WHERE user_allowed_res.user_id = $user_id AND user_allowed_res.flag = 'append'
		";
		return $this->db_query($q);
	}


	/**
	 * Allow access to the given resource for the given user
	 * @access public
	 * @param integer $user_id     User ID
	 * @param integer $resource_id     Resource ID
	 * @throws App_Db_Exception_Table if either user or resource id is not specified
	 */
	function allow($user_id, $resource_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');
		if(empty($resource_id))
			throw new App_Db_Exception_Table('Resource ID is not specified');

		$result = $this->db_select($this->_table, array('id'), array('user_id'=>$user_id, 'resource_id'=>$resource_id));
		if($row = $this->db_fetch_row($result))
		{
			$id = $row[0];
			//check if resource is allowed by role
			$q = "SELECT
					res.id
				FROM bs_resources res
				JOIN bs_role_allowed_resources role_res ON role_res.resource_id = res.id
				JOIN bs_staff_roles staff_roles ON staff_roles.role_id = role_res.role_id
				JOIN bs_staff_user staff_user ON staff_user.staff_id = staff_roles.staff_id
				WHERE staff_user.user_id = $user_id AND staff_user.is_active = 1 AND res.id = $resource_id
			";
			$resultRes = $this->db_query($q);
			if($row = $this->db_fetch_row($resultRes)) //if allowed by role, it makes no sense to leave 'append' item
			{
				Table_Log::insert_deleted($this->_table, $id, 'id');
				$this->db_delete($this->_table, array('id'=>$id));
			}
			else
			{
				$update_data = array('flag'=>'append');
				$old_select = $this->db_select($this->_table, array(), array('id'=>$id));
				Table_Log::insert_modified($this->_table, $id, $old_select, $update_data);
				$this->db_update($this->_table, $update_data, array('id'=>$id));
			}
		}
		else
		{
			$insert_data = array('user_id'=>$user_id, 'resource_id'=>$resource_id, 'flag'=>'append');
			$this->db_insert($this->_table, $insert_data);
			$id = $this->db_insert_id();
			Table_Log::insert_added($this->_table, $id, $insert_data);
		}
	}


	/**
	 * Deny access to the given resources for the given user
	 * @access public
	 * @param integer $user_id     User ID
	 * @param integer $resource_id     Resource ID
	 * @throws App_Db_Exception_Table if either user or resource id is not specified
	 */
	function deny($user_id, $resource_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');
		if(empty($resource_id))
			throw new App_Db_Exception_Table('Resource ID is not specified');

		$result = $this->db_select($this->_table, array('id'), array('user_id'=>$user_id, 'resource_id'=>$resource_id));
		if($row = $this->db_fetch_row($result))
		{
			$id = $row[0];
			//check if resource is denied by role
			$q = "SELECT
					res.id
				FROM bs_resources res
				JOIN bs_role_allowed_resources role_res ON role_res.resource_id = res.id
				JOIN bs_staff_roles staff_roles ON staff_roles.role_id = role_res.role_id
				JOIN bs_staff_user staff_user ON staff_user.staff_id = staff_roles.staff_id
				WHERE staff_user.user_id = $user_id AND staff_user.is_active = 1 AND res.id = $resource_id
			";
			$resultRes = $this->db_query($q);
			if($row = $this->db_fetch_row($resultRes))
			{
				$update_data = array('flag'=>'subtract');
				$old_select = $this->db_select($this->_table, array(), array('id'=>$id));
				Table_Log::insert_modified($this->_table, $id, $old_select, $update_data);
				$this->db_update($this->_table, $update_data, array('id'=>$id));
			}
			else //if denied by role, it makes no sense to leave 'subtract' item
			{
				Table_Log::insert_deleted($this->_table, $id, 'id');
				$this->db_delete($this->_table, array('id'=>$id));
			}
		}
		else
		{
			$insert_data = array('user_id'=>$user_id, 'resource_id'=>$resource_id, 'flag'=>'subtract');
			$this->db_insert($this->_table, $insert_data);
			$id = $this->db_insert_id();
			Table_Log::insert_added($this->_table, $id, $insert_data);
		}
	}


	/**
	 * Deny access to all resources for the given user
	 * @access public
	 * @param integer $user_id    User ID
	 * @throws App_Db_Exception_Table if user id is not specified
	 */
	function resetAll($user_id)
	{
		if(empty($user_id))
			throw new App_Db_Exception_Table('User ID is not specified');

		$result = $this->db_select($this->_table, array('id'), array('user_id'=>$user_id));
		while($row = $this->db_fetch_row($result))
		{
			$id = $row[0];
			Table_Log::insert_deleted($this->_table, $id, 'id');
		}
		$this->db_delete($this->_table, array('user_id'=>$user_id));
	}
}
