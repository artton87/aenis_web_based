<?php
/**
 * Permission groups - roles management
 * @package Sysadmin\Permissions
 */

/**
 * Methods for working with permission groups - roles
 * @author BestSoft
 * @package Sysadmin\Permissions
 */
class Roles extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'roles';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'roles';


    /**
     * Returns list of roles
     * @access public
     * @param integer $role_id    Optional. Role ID
	 * @param string $role_code    Optional. Role code
     * @return mysqli_result|resource
     */
    public function getRoles($role_id=null, $role_code=null)
    {
    	$filter = array();
		if(!empty($role_id) || !empty($role_code))
		{
			if(!empty($role_id))
				$filter['id'] = $role_id;
			if(!empty($role_code))
				$filter['code'] = $role_code;
		}
		return $this->db_select($this->_table, array('id', 'title'), $filter, array('title'));
    }
    
    
    /**
     * Checks correctness of role fields
     * @access protected
     * @param integer $role_id    Role ID
     * @param array $data   Associative array with fields as in 'roles' database table
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
     */
    protected function validateRole($role_id, $data)
    {
        if(empty($data['title']))
        	throw new App_Db_Exception_Validate('Իրավունքների խմբի անվանումը բացակայում է:');

		$where = array('title' => $data['title']);
		if(!empty($role_id))
			$where[] = "id <> $role_id";
		$result = $this->db_select($this->_table, array('id'), $where, array(), 1);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Իրավունքների խմբի անվանումը կրկնվում է:');
    }
    
    
    /**
     * Sets resource/permission pairs, which are included in the given role
     * @access public
     * @param integer $role_id    Role ID
     * @param array $permissions   Array with resource_id, allowed pairs
	 * @throws App_Db_Exception_Table if role id is not specified
     */
    protected function setRoleResources($role_id, $permissions)
    {
        if(empty($role_id))
        	throw new App_Db_Exception_Table('Role id is not specified');
        $role_id = intval($role_id);

		$oRoleResources = new Role_Resources();
		foreach($permissions as $info)
		{
			if($info->allowed)
			{
				$oRoleResources->allow($role_id, $info->resource_id);
			}
			else
			{
				$oRoleResources->deny($role_id, $info->resource_id);
			}
		}
    }


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with role fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'title' => $data['title']
		);
	}

    
    /**
     * Add new role
     * @access public
     * @param array $data   Associative array with fields as in 'roles' database table
     * @return integer    ID of newly added role
     */
    public function addRole($data)
    {
        $this->validateRole(0, $data);
        $this->db_insert($this->_table, $this->getDbFields($data));
        $role_id = $this->db_insert_id();
        $this->setRoleResources($role_id, $data['permissions']);
		App_Cache()->refreshTags(self::CACHE_TAG);
        return $role_id;
    }

    
    /**
     * Edit an existing role
     * @access public
     * @param integer $role_id    Role ID
     * @param array $data   Associative array with fields as in 'roles' database table
	 * @throws App_Db_Exception_Table if role id is not specified
     */
    public function updateRole($role_id, $data)
    {
        if(empty($role_id))
        	throw new App_Db_Exception_Table('Role id is not specified');
        $this->validateRole($role_id, $data);
        $this->db_update($this->_table, $this->getDbFields($data), array('id'=>$role_id));
        $this->setRoleResources($role_id, $data['permissions']);
		App_Cache()->refreshTags(self::CACHE_TAG);
    }
    
    
    /**
     * Removes role
     * @access public
     * @param integer $role_id    Role ID
	 * @throws App_Db_Exception_Table if role id is not specified
     */
    public function deleteRole($role_id)
    {
        if(empty($role_id))
        	throw new App_Db_Exception_Table('Role ID is not specified');

		$oRoleResources = new Role_Resources();
		$oRoleResources->denyAll($role_id);

		$oStaffRoles = new Staff_Roles();
		$oStaffRoles->removeRole($role_id);

		$this->db_delete($this->_table, array('id' => $role_id));
		App_Cache()->refreshTags(self::CACHE_TAG);
    }
}
