<?php
/**
 * Role resources management
 * @package Sysadmin\Permissions
 */

/**
 * Methods and function for role resource management
 * @author BestSoft
 * @package Sysadmin\Permissions
 */
class Role_Resources extends App_Db_Table_Abstract
{
	protected $_table = 'role_allowed_resources';


	/**
	 * Returns list of all resources with flag, which shows if resource is allowed for the given role
	 * @access public
	 * @param integer $role_id    Role ID
	 * @param boolean $include_root_resources    Optional. Whenever to include resources, which only root can see
	 * @return mysqli_result|resource
	 * @throws App_Db_Exception_Table if role id is not specified
	 */
	public function getResources($role_id, $include_root_resources = false)
    {
		$include_root_resources_condition = $include_root_resources ? '' : 'WHERE res.is_root_resource=0';
		$role_id = intval($role_id);
		$q = "SELECT
				role_res.role_id, res.id AS resource_id, res.title, res.code, res.type,
				IFNULL(role_res.id, 0) AS role_allowed_res_id
			FROM bs_resources res
			LEFT JOIN bs_".$this->_table." role_res ON role_res.resource_id = res.id AND role_res.role_id=$role_id
			$include_root_resources_condition
			ORDER BY res.title ASC, res.code ASC
		";
		return $this->db_query($q);
	}


	/**
	 * Allow access to the given resource for the given role
	 * @access public
	 * @param integer $role_id     Role ID
	 * @param integer $resource_id     Resource ID
	 * @throws App_Db_Exception_Table if either role or resource id is not specified
	 */
	function allow($role_id, $resource_id)
	{
		if(empty($role_id))
			throw new App_Db_Exception_Table('Role ID is not specified');
		if(empty($resource_id))
			throw new App_Db_Exception_Table('Resource ID is not specified');

		$this->db_insert($this->_table, array('role_id'=>$role_id, 'resource_id'=>$resource_id));
	}


    /**
     * Deny access to the given resource for the given role
     * @access public
     * @param integer $role_id     Role ID
     * @param integer $resource_id     Resource ID
	 * @throws App_Db_Exception_Table if either role or resource id is not specified
     */
	function deny($role_id, $resource_id)
	{
		if(empty($role_id))
            throw new App_Db_Exception_Table('Role ID is not specified');
		if(empty($resource_id))
			throw new App_Db_Exception_Table('Resource ID is not specified');
		
        $this->db_delete($this->_table, array('role_id'=>$role_id, 'resource_id'=>$resource_id));
	}


	/**
	 * Deny access to all resources for the given role
	 * @access public
	 * @param integer $role_id    Role ID
	 * @throws App_Db_Exception_Table if role id is not specified
	 */
	function denyAll($role_id)
	{
	    if(empty($role_id))
            throw new App_Db_Exception_Table('Role ID is not specified');

		$this->db_delete($this->_table, array('role_id' => $role_id));
	}
}
