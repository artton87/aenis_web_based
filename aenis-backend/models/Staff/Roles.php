<?php
/**
 * Staff roles management
 * @package aenis\Structure
 */

/**
 * Contains methods for staff roles management
 * @author BestSoft
 * @package aenis\Structure
 */
class Staff_Roles extends App_Db_Table_Abstract
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'staff_roles';


	/**
     * Sets staff roles
     * @access public
     * @param integer $staff_id     Staff ID
     * @param array $roles     Array with role IDs
     */
    public function setRoles($staff_id, $roles)
    {
    	$existing_roles = array();
    	$result = $this->getRoles($staff_id);
    	while($row = $this->db_fetch_array($result))
    	{
			$existing_roles[] = $row['id'];
    	}
    	$roles_to_be_deleted = array_diff($existing_roles, $roles);
    	$roles_to_be_inserted = array_diff($roles, $existing_roles);
		
		if(!empty($roles_to_be_deleted))
			$this->db_delete('staff_roles', array('staff_id'=>$staff_id, 'role_id IN ('.implode(',',$roles_to_be_deleted).')'));
		
		foreach($roles_to_be_inserted as $role_id)
        {
			$this->db_insert('staff_roles', array('staff_id'=>$staff_id, 'role_id'=>$role_id));
        }
    }
    
    
    /**
     * Removes staff roles
     * @access public
     * @param integer $staff_id     Staff ID
     */
    public function deleteRoles($staff_id)
    {
		$this->db_delete('staff_roles', array('staff_id'=>$staff_id));
    }
    
    
    /**
     * Returns staff roles
     * @access public
     * @param integer $staff_id    Staff ID
     * @return mysqli_result
     */
    public function getRoles($staff_id)
    {
    	$q = "SELECT 
    			roles.id, roles.title
			FROM bs_staff_roles staff_roles
			LEFT JOIN bs_roles roles ON roles.id = staff_roles.role_id
			WHERE staff_roles.staff_id = ".intval($staff_id)."
			ORDER BY roles.title ASC
		";
		return $this->db_query($q);
    }


	/**
	 * Removes given role from the staff roles list
	 * @access public
	 * @param integer $role_id     Role ID
	 * @throws App_Db_Exception_Table if role id is not specified
	 */
	public function removeRole($role_id)
	{
		if(empty($role_id))
			throw new App_Db_Exception_Table('Role id is not specified');
		$this->db_delete($this->_table, array('role_id'=>$role_id));
	}
}
