<?php
/**
 * Staff positions management
 * @package aenis\Structure
 */

/**
 * Methods for staff positions management
 * @author BestSoft
 * @package aenis\Structure
 */
class Staff extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'staff';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'staff';


	/**
     * Returns staff positions with their details as tree or as list (if there are filters specified)
     * @access public
     * @param integer $root_member_id    ID of tree 'root' staff
     * @param boolean $bDetailed     Optional. If TRUE - returns all fields, otherwise returns only idd, name
     * @param array $filters    Optional. Associative array with search parameters
     * @param boolean $with_user    Optional. Whenever to return current user name appended to staff title
     * @param boolean $with_root    Optional. Whenever to include 'root' department in result
     * @return mysqli_result
     */
    public function getMembers($root_member_id = 0, $bDetailed = false, $filters = array(), $with_user = false, $with_root = false)
    {
		//this fields always should be selected
        $select_vec = array('staff.id', 'staff.title', 'dep.id AS dep_id', 'dep.title AS dep_title');
        if($with_user)
        	$select_vec[] = 'getStaffName(staff.id, NULL) AS title_with_user';
       
        //append additional columns, needed for detailed information
		$extra_joins = 'LEFT JOIN bs_departments dep ON staff.dep_id = dep.id';
        if($bDetailed)
        {
            array_push($select_vec, 
            	'staff.num', 'pstaff.id AS parent_id', 'pstaff.title AS parent_title'
            );
            $extra_joins .= '
            	LEFT JOIN bs_staff pstaff ON pstaff.id = staff.parent_id AND pstaff.parent_id IS NOT NULL
            ';
		}
        
        $select_cols = implode(',', $select_vec);
        
        //query variables to include only descendants of given member in select query
        if(empty($root_member_id))
        {
			$row = $this->getRootMember();
			if(null === $row) return FALSE;
		}
        else
        {
			$result = $this->db_select('staff', array('lft','rgt'), array('id'=>$root_member_id));
			$row = $this->db_fetch_array($result);
		}
		
		if($with_root && $root_member_id!=0) {
			$root_lft = $row['lft']; // include root
			$root_rgt = $row['rgt']; // include root
		} else {
			$root_lft = $row['lft']+1; //don't include root
			$root_rgt = $row['rgt']-1; //don't include root
		}
        
        if(empty($filters)) //no filter given, return as tree
		{
			$select_null = implode(',', array_fill(0, count($select_vec), 'NULL'));
			
			// main query should be constructed to keep this formula true:
	        // (record count of 2nd SELECT) = (record count of 1st SELECT) - (record count of 1st SELECT with xml_tag=1)
	        $q = "
	            (
	               SELECT
           				(
           					SELECT staff_user.user_id FROM bs_staff_user staff_user
           					WHERE staff_user.staff_id = staff.id AND staff_user.is_active=1
           					LIMIT 1
           				) AS active_user_id,
           				staff.lft as n, staff.rgt-staff.lft as xml_tag, $select_cols
	               FROM bs_{$this->_table} staff
	               $extra_joins
	               WHERE (staff.lft BETWEEN $root_lft AND $root_rgt)
	            )
	            UNION ALL 
	            (
	               SELECT 0 AS active_user_id, staff.rgt as n, 0 as xml_tag, $select_null
	               FROM bs_{$this->_table} staff
	               $extra_joins
	               WHERE (staff.lft BETWEEN $root_lft AND staff.rgt-2) AND staff.rgt<=$root_rgt
	            )
	            ORDER BY n
	        ";
		}
		else
		{
			//build filter
			$where = array();
	        if(!empty($filters['member_name']))
			{
				$or = array(
					"staff.title LIKE '%".$this->db_escape_string($filters['member_name'])."%'",
					"(getStaffName(staff.id, NULL) LIKE '%".$this->db_escape_string($filters['member_name'])."%')"
				);
				if(is_numeric($filters['member_name']) && $filters['member_name'] == intval($filters['member_name']))
				{
					$or[] = "staff.id = ".intval($filters['member_name']);
				}
				$where[] = '('.implode(' OR ', $or).')';
			}
			if(!empty($filters['staff_id']))
				$where[] = "staff.id = ".intval($filters['staff_id']);
				
			if(!empty($filters['staff_ids']))
				$where[] = "staff.id IN (".implode(',',$filters['staff_ids']).')';
			
			$where = (count($where)>0) ? 'AND '.implode(' AND ', $where) : '';
			
			$q = "
				SELECT
           			(
           				SELECT staff_user.user_id FROM bs_staff_user staff_user
           				WHERE staff_user.staff_id = staff.id AND staff_user.is_active=1
           				LIMIT 1
           			) AS active_user_id,
           			staff.lft as n, staff.rgt-staff.lft as xml_tag, $select_cols
	           FROM bs_{$this->_table} staff
	           $extra_joins
	           WHERE (staff.lft BETWEEN $root_lft AND $root_rgt) $where
	           ORDER BY staff.num ASC, staff.title ASC
	        ";
		}
        return $this->db_query($q);
    }
    
    
    /**
     * Returns details of 'root' staff position
     * @access public
     * @return array|null    Associative array with 'id','lft','rgt' fields, or null
     */
    public function getRootMember()
    {
		$result = $this->db_select(
			$this->_table,
			array('id', 'lft', 'rgt'),
			array('parent_id IS NULL')
		);
        if($row = $this->db_fetch_array($result))
        {
			return $row;
        }
        return null;
    }
    
    
    /**
     * Add 'root' staff position. Except 'root' position, all other positions have parent.
	 * Tries to add under 'root' department. If such department cannot be found, creates a new one. 
     * @access public
     */
    public function addRootMember()
    {
    	//add under ROOT department
        $oDep = new Departments();
        if(!($row = $oDep->getRootDepartment())) //if department exists, fetch it to $row
        {
			$oDep->addRootDepartment(true); //if such department does not exist, create it
			$row = $oDep->getRootDepartment(); //and fetch the newly created record into $row
        }
        $dep_id = $row['id']; 
        
        if(empty($dep_id))
        	throw new App_Db_Exception_Table('ROOT department cannot be instantiated');
        
		$insert_data = array(
        	'title' => 'ROOT',
        	'parent_id' => self::$DB_NULL,
        	'dep_id' => $dep_id,
        	'num' => self::$DB_NULL,
        	'lft' => 1,
        	'rgt' => 2,
        );
        $dba = $this->getAdapter();
        $dba->insert($this->_table, $insert_data);
        $staff_id = $dba->insert_id();
        
        //set ROOT role
        $oRoles = new Roles();
        $result = $oRoles->getRoles(null, 'ROOT');
        if($row = $oRoles->db_fetch_array($result))
        {
        	$oStaffRoles = new Staff_Roles();
        	$oStaffRoles->setRoles($staff_id, array($row['id']));
        }
    }
    
    
    /**
     * Sets department for the ROOT staff
     * @access public
     * @param integer $dep_id    Department ID
     */
    public function setRootMemberDepartment($dep_id)
    {
		$this->db_update($this->_table, array('dep_id'=>$dep_id), array('lft'=>1));
    }
    
    
    /**
     * Checks correctness of staff fields
     * @access protected
     * @param integer $member_id    Staff ID
     * @param array $data   Associative array with fields as of 'staff' table in database
     * @param array $root    Value returned from Staff::getRootMember() function
	 * @throws App_Db_Exception_Validate if some validation fail
     * @see Staff::getRootMember()
     */
    protected function validateMember($member_id, $data, $root)
    {
        if(empty($data['member_name']))
        	throw new App_Db_Exception_Validate('Պաշտոնի անվանումը դատարկ է:');
        if(empty($data['dep_id']))
        	throw new App_Db_Exception_Validate('Պաշտոնի ստորաբաժանումը նշված չէ:');
        if(!is_array($data['roles']) || 0==count($data['roles']) )
        	throw new App_Db_Exception_Validate('Պաշտոնի իրավունքների խմբերը նշված չեն:');
        
        if(!empty($member_id))
        {
        	$result = $this->db_select($this->_table, array('lft','rgt'), array('id'=>$member_id));
        	$row = $this->db_fetch_array($result);
        	$member_lft = $row['lft'];
        	$member_rgt = $row['rgt'];
        	
        	$result = $this->db_select(
				$this->_table, array('id'),
        		array(
        			$member_lft.' <= lft',
        			'lft < '.$member_rgt,
        			'id' => empty($data['member_parent_id']) ? $root['id'] : $data['member_parent_id']
        		)
        	);
        	if($row = $this->db_fetch_row($result))
				throw new App_Db_Exception_Validate('Պաշտոնը չի կարող ուղղակի կամ անուղղակի հանդիսանալ ինքն իր ստորադասը:');
		}
    }
    
    
    /**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with staff fields
     * @param array $root    Value returned from getRootMember() function
     * @see Staff::getRootMember()
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data, $root)
    {
		return array(
        	'title' => $data['member_name'],
        	'parent_id' => empty($data['member_parent_id']) ? $root['id'] : $data['member_parent_id'],
        	'dep_id' => $data['dep_id'],
        	'num' => empty($data['member_num']) ? self::$DB_NULL : $data['member_num']
        );
    }
    
    
    /**
     * Add new staff position
     * @access public
     * @param array $data    Associative array with staff position fields
     */
	public function addMember($data)
	{
		$root = $this->getRootMember();
		if(null === $root)
		{
			$this->addRootMember();
			$root = $this->getRootMember();
		}
		$this->validateMember(0, $data, $root);
        
        $insert_data = $this->getDbFields($data, $root);
        
        $dba = $this->getAdapter();
        $dba->insert($this->_table, $insert_data);
        $member_id = $dba->insert_id();
        $oStaffRoles = new Staff_Roles();
		$oStaffRoles->setRoles($member_id, $data['roles']);
        Table_Log::insert_added($this->_table, $member_id, $insert_data);
        
        $this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'num', $root['id'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
	
	
	/**
     * Update existing staff position
     * @access public
     * @param integer $member_id    Staff position ID
     * @param array $data    Associative array with staff position fields
	 * @throws App_Db_Exception_Table if staff id is not given or user attempts to modify root record
     */
    public function updateMember($member_id, $data)
    {
        if(empty($member_id))
        	throw new App_Db_Exception_Table('Staff ID is not specified');
        
        $root = $this->getRootMember();
        if(null === $root)
        	throw new App_Db_Exception_Table('Root member does not exist');
        
        if($member_id == $root['id'])
        	throw new App_Db_Exception_Table('Invalid member ID. Root member should not be edited.');
        
        $this->validateMember($member_id, $data, $root);
        
        $update_data = $this->getDbFields($data, $root);
        $old_select = $this->db_select($this->_table, array(), array('id'=>$member_id));
        $oStaffRoles = new Staff_Roles();
		$oStaffRoles->setRoles($member_id, $data['roles']);
        Table_Log::insert_modified($this->_table, $member_id, $old_select, $update_data);
        $this->db_update($this->_table, $update_data, array('id'=>$member_id));
        
        //during update, root always is present, as it was added previously
        $this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'num', $root['id'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
    }
    
    
	/**
	 * Removes staff position with the given ID
	 * @access public
	 * @param integer $id    Staff position ID
	 * @throws App_Db_Exception_Table if staff id is not specified or root staff is missing
	 * @throws App_Db_Exception_Validate if there are users attached to that staff
	 */
	public function deleteMember($id)
	{
		if(empty($id))
        	throw new App_Db_Exception_Table('Staff ID is not specified');
        
        $root = $this->getRootMember();
        if(null === $root)
        	throw new App_Db_Exception_Table('Root member does not exist');
        
        $result = $this->db_select('staff_user', array('id'), array('staff_id'=>$id));
        if($row = $this->db_fetch_array($result))
        {
			throw new App_Db_Exception_Validate('Պաշտոնը հնարավոր չէ հեռացնել, քանի որ այդ պաշտոնին կան նշանակված կամ նշանակված էին օգտվողներ');
        }
        
		Table_Log::insert_deleted($this->_table, $id, 'id');
		$oStaffRoles = new Staff_Roles();
		$oStaffRoles->deleteRoles($id);
		$this->db_delete($this->_table, array('id'=>$id));
		
		$this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'num', $root['id'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
	
    
    /**
     * Returns all positions parent to position with given $staff_id, including that one, 
     * and are child to position with $stop_staff_id
     * @access public
     * @param integer $staff_id     Staff ID
     * @param integer $stop_staff_id     Stop staff ID
	 * @return array    Array with staff ids
     */
    public function getParentChain($staff_id, $stop_staff_id = null)
    {
    	$dba = $this->getAdapter();
    	if(empty($stop_staff_id))
    	{
    		$root = $this->getRootMember();
    		$stop_staff_id = $root['id'];
		}
		
		$query = "SELECT p2.id
				  FROM bs_staff p1 JOIN bs_staff p2
					ON p1.lft between p2.lft and p2.rgt
				  WHERE p1.id = $staff_id ORDER BY p2.lft";	

		$parents = array();
		$result = $dba->query($query);
		while($row = $dba->fetch_array($result))
		{
			if($row['id']!=$stop_staff_id)
			{
				$parents[] = $row['id'];
			}
		}
		return $parents;
    }
    
	
	/**
     * Returns true, if there is a user for the given staff and false - otherwise
     * @access public
     * @param integer $staff_id     Staff ID
	 * @throws App_Db_Exception_Table if staff id is not specified
     * @return boolean
     */
    public function isStaffOccupied($staff_id)
    {
		if(empty($staff_id))
        	throw new App_Db_Exception_Table('Staff ID is not specified');
        	
        $q = "SELECT
        		staff_user.staff_id
        	FROM bs_staff_user staff_user
            WHERE staff_user.staff_id = ".intval($staff_id)." AND staff_user.is_active=1
            ";
        if($row = $this->db_fetch_row($q))
        {
			return true;
        }
        return false;
    }
    
    
    /**
     * Returns regions of the given staff
     * @access public
     * @param array $staff_ids    Array of staff ids or single staff id
     * @return mysqli_result
     */
    public function getStaffRegions($staff_ids)
    {
		$staff_ids = (array)$staff_ids;
		$q = 'SELECT 
				dep.dep_region_id AS region_id
			FROM bs_staff staff
			LEFT JOIN bs_departments dep ON dep.id = staff.dep_id
			WHERE staff.id IN ('.implode(',', $staff_ids).')
		';
		return $this->db_query($q);
    }


	/**
	 * Returns query, which selects 'user_id' of all staffs, which
	 * are direct or indirect descendants of the given staff ids.
	 * @param array|integer $staff_ids    Array with staff ids or a single staff id
	 * @return string    A resulting query
	 */
	public function getStaffsDescendantUsersQuery($staff_ids)
	{
		$staff_ids = (array)$staff_ids;
		$or_conditions = array();
		foreach($staff_ids as $staff_id)
		{
			$result = $this->db_select('staff', array('lft','rgt'), array('id'=>$staff_id));
			if($row = $this->db_fetch_array($result))
			{
				$lft = $row['lft'];
				$rgt = $row['rgt'];
				$or_conditions[] = "(staff.lft>=$lft AND staff.lft<$rgt)";
			}
		}
		$or_conditions = implode(' OR ', $or_conditions);
		if(!empty($or_conditions))
			$or_conditions = "AND ($or_conditions)";

		return "(
			SELECT user_id
			FROM bs_staff_user su
			JOIN bs_staff staff ON staff.id = su.staff_id
			WHERE su.is_active=1 $or_conditions
		)";
	}
}
