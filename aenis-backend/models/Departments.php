<?php
/**
 * Departments management
 * @package aenis\Structure
 */

/**
 * Methods for department management
 * @author BestSoft
 * @package aenis\Structure
 */
class Departments extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'department';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'departments';


	/**
	 * Returns next staff from the given department
	 * @access public
	 * @param integer $dep_id    Department ID
	 * @param integer $staff_type_id    Staff type ID. One of Staff_Types::STAFF_TYPE_XXX constants
	 * @throws App_Db_Exception_Table if department id is not specified
	 * @return integer    Staff ID
	 */
	public function getNextStaffToUse($dep_id, $staff_type_id)
	{
		if(empty($dep_id))
			throw new App_Db_Exception_Table('Department ID is not specified');
		
		$q = "SELECT IFNULL(
				(
					SELECT 
						staff.id
					FROM bs_staff staff
					WHERE staff.dep_id = $dep_id AND staff.type_id = $staff_type_id AND IFNULL((
						SELECT gstaff.id
						FROM bs_staff gstaff
						WHERE gstaff.dep_id = staff.dep_id AND gstaff.is_used_last_in_dep = 1
						LIMIT 1
					),0) < staff.id
					ORDER BY staff.id ASC
					LIMIT 1
				),
				(
					SELECT
						staff.id
					FROM bs_staff staff
					WHERE staff.dep_id = $dep_id AND staff.type_id = $staff_type_id
					ORDER BY staff.id ASC
					LIMIT 1
				)
			) AS id
			FROM dual
		";
		$result = $this->db_query($q);
		if($row = $this->db_fetch_row($result))
		{
			$staff_id = $row[0];
			$this->db_update('staff', array('is_used_last_in_dep'=>0), array('dep_id'=>$dep_id, 'is_used_last_in_dep'=>1));
			$this->db_update('staff', array('is_used_last_in_dep'=>1), array('id'=>$staff_id));
			return $staff_id;
		}
		return 0;
	}
	
	/**
     * Returns departments with their details as tree or as list (if there are filters specified)
     * @access public
     * @param integer $root_member_id    ID of tree 'root' department
	 * @param boolean $bDetailed     Optional. If TRUE - returns all fields, otherwise returns only idd, name
     * @param array $filters    Optional. Associative array with search parameters
     * @param boolean $with_root    Optional. Whenever to include 'root' department in result
     * @return mysqli_result
     */
    public function getDepartments($root_member_id = 0, $bDetailed = false, $filters = array(), $with_root = false)
    {
		//this fields always should be selected
        $select_vec = array(
			'dep.id', 'dep.title',
			'dep.parent_id', 'dep.notarial_office_id',
			'dep.phone', 'dep.fax', 'dep.email', 'dep.code', 'dep.dep_type_id'
		);
       
		//append additional columns, needed for detailed information
		$extra_joins = '';
		if($bDetailed)
		{
			$oLanguages = new Languages();
			$default_lang_id = $oLanguages->getDefaultLanguage()->id;

			array_push($select_vec,
				'pdep.title AS parent_title',
				"getNotarialOfficeTitle(dep.notarial_office_id, $default_lang_id) AS notarial_office_title"
			);
			$extra_joins = 'LEFT JOIN bs_departments pdep ON pdep.id = dep.parent_id AND pdep.parent_id IS NOT NULL';
		}

		$select_cols = implode(',', $select_vec);
        
        //query variables to include only descendants of given member in select query
        if(empty($root_member_id))
        {
			$row = $this->getRootDepartment();
			if(null === $row) return FALSE;
		}
        else
        {
			$result = $this->db_select($this->_table, array('lft','rgt'), array('id'=>$root_member_id));
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
	               SELECT dep.lft as n, dep.rgt-dep.lft as xml_tag, $select_cols
	               FROM bs_{$this->_table} dep
	               $extra_joins
	               WHERE (dep.lft BETWEEN $root_lft AND $root_rgt)
	            )
	            UNION ALL 
	            (
	               SELECT dep.rgt as n, 0 as xml_tag, $select_null
	               FROM bs_{$this->_table} dep
	               $extra_joins
	               WHERE (dep.lft BETWEEN $root_lft AND dep.rgt-2) AND dep.rgt<=$root_rgt
	            )
	            ORDER BY n
	        ";
		}
		else
		{
			//build filter
			$where = array();
	        if(!empty($filters['dep_title']))
			{
				$or = array("dep.title LIKE '%".$this->db_escape_string($filters['dep_title'])."%'");
				if(is_numeric($filters['dep_title']) && $filters['dep_title'] == intval($filters['dep_title']))
				{
					$or[] = "dep.id = ".intval($filters['dep_title']);
				}
				$where[] = '('.implode(' OR ', $or).')';
			}
			if(!empty($filters['dep_id']))
				$where[] = "dep.id = ".intval($filters['dep_id']);
			
			$where = (count($where)>0) ? 'AND '.implode(' AND ', $where) : '';
			
			$q = "
				SELECT $select_cols
				FROM bs_{$this->_table} dep
				$extra_joins
				WHERE (dep.lft BETWEEN $root_lft AND $root_rgt) $where
	            ORDER BY dep.num ASC, dep.title ASC
	        ";
		}
        return $this->db_query($q);
    }
    
    
    /**
     * Returns ID (idd), LFT, RGT of 'root' department
     * @access public
     * @return array    Associative array with 'idd','lft','rgt' fields, or null
     */
    public function getRootDepartment()
    {
		$result = $this->db_select(
			$this->_table,
			array('id', 'lft','rgt'),
			array('parent_id IS NULL')
		);
        if($row = $this->db_fetch_array($result))
        {
			return $row;
        }
        return null;
    }
    
    
    /**
     * Appends new 'root' department.
     * Except of this department, all others have parent department
     * @access public
     * @param boolean $doNotCreateRootStaff    Optional. Whenever to create also ROOT staff
     * @return integer    ID of newly created 'root' department
     */
    public function addRootDepartment($doNotCreateRootStaff = false)
    {
		$insert_data = array(
        	'title' => 'ROOT',
        	'parent_id' => self::$DB_NULL,
        	'lft' => 1,
        	'rgt' => 2
        );
        $this->db_insert($this->_table, $insert_data);
        $dep_id = $this->db_insert_id();
        
        if(!$doNotCreateRootStaff)
        {
			$oStaff = new Staff();
	        if($row = $oStaff->getRootMember())
	        {
				$oStaff->setRootMemberDepartment($dep_id);
	        }
	        else
	        {
				$oStaff->addRootMember();
	        }
        }
        return $dep_id;
    }
    
    
    /**
     * Checks correctness of department fields
     * @access protected
     * @param integer $dep_id    Department ID
     * @param array $data    Associative array with department fields
     * @param array $root    Value returned from Department::getRootDepartment() function
	 * @throws App_Db_Exception_Validate if some validation fail
     * @see Department::getRootDepartment()
     */
    protected function validateDepartment($dep_id, $data, $root)
    {
        if(empty($data['title']))
        	throw new App_Db_Exception_Validate('Ստորաբաժանման անվանումը դատարկ է:');
        if(empty($data['code']))
        	throw new App_Db_Exception_Validate('Ստորաբաժանման ծածկագիրը դատարկ է:');
        
        if(!empty($dep_id))
        {
        	$result = $this->db_select($this->_table, array('lft','rgt'), array('id'=>$dep_id));
        	$row = $this->db_fetch_array($result);
        	$lft = $row['lft'];
        	$rgt = $row['rgt'];
        	
        	$result = $this->db_select(
				$this->_table, array('id'),
        		array(
        			$lft.' <= lft',
        			'lft < '.$rgt,
        			'id' => empty($data['parent_id']) ? $root['id'] : $data['parent_id']
        		)
        	);
        	if($row = $this->db_fetch_array($result))
        	{
				throw new App_Db_Exception_Validate('Ստորաբաժանումը չի կարող ուղղակի կամ անուղղակի հանդիսանալ ինքն իր ստորադասը:');
        	}
        	
        	$result = $this->db_select($this->_table, array('id'), array("lft>$lft", "lft<$rgt"));
        	if($row = $this->db_fetch_array($result))
        	{
				throw new App_Db_Exception_Validate('Ստորաբաժանման ստորադասներից որևէ մեկի մարզը տարբերվում է նշված մարզից:');
        	}
		}
    }
    
    
    /**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with department fields
     * @param array $root    Value returned from Department::getRootDepartment() function
     * @see Department::getRootDepartment()
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data, $root)
    {
		return array(
        	'title' => $data['title'],
        	'parent_id' => empty($data['parent_id']) ? $root['id'] : $data['parent_id'],
        	'dep_type_id' => empty($data['dep_type_id']) ? self::$DB_NULL : $data['dep_type_id'],
        	'code' => $data['code'],
        	'phone' => $data['phone'],
        	'fax' => $data['fax'],
        	'email' => $data['email'],
        	'notarial_office_id' => empty($data['notarial_office_id']) ? self::$DB_NULL : $data['notarial_office_id'],
        	'num' => empty($data['num']) ? self::$DB_NULL : $data['num']
        );
    }
    
    
    /**
     * Add new department
     * @access public
     * @param array $data    Associative array with department fields
     * @return integer    ID of newly created department
     */
	public function addDepartment($data)
	{
		$root = $this->getRootDepartment();
		if(null === $root)
		{
			$this->addRootDepartment();
			$root = $this->getRootDepartment();
		}
		$this->validateDepartment(0, $data, $root);
        
        $insert_data = $this->getDbFields($data, $root);
        
        $this->db_insert($this->_table, $insert_data);
        $dep_id = $this->db_insert_id();
        Table_Log::insert_added($this->_table, $dep_id, $insert_data);
        
        $this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'num', $root['id'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $dep_id;
	}
	
	
	/**
     * Edit an existing department
     * @access public
     * @param integer $dep_id    Department ID
     * @param array $data    Associative array with department fields
	 * @throws App_Db_Exception_Table id department id is not specified or if root department is missing
     */
    public function updateDepartment($dep_id, $data)
    {
        if(empty($dep_id))
			throw new App_Db_Exception_Table('Department ID is not specified');
        
        $root = $this->getRootDepartment();
        if(null === $root)
			throw new App_Db_Exception_Table('ROOT department does not exist');
        
        if($dep_id == $root['id'])
        	throw new App_Db_Exception_Table('Invalid department ID. ROOT department cannot be edited');
        
        $this->validateDepartment($dep_id, $data, $root);
        
        $update_data = $this->getDbFields($data, $root);
        
        $old_select = $this->db_select($this->_table, array(), array('id'=>$dep_id));
        Table_Log::insert_modified($this->_table, $dep_id, $old_select, $update_data);
        
        $this->db_update($this->_table, $update_data, array('id'=>$dep_id));
        
        //during update, root always is present, as it was added previously
        $this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'num', $root['id'], 1 );
		App_Cache()->refreshTags(self::CACHE_TAG);
 
    }
	
	
	/**
	 * Removes the given department
     * @access public
     * @param integer $id    Department ID
	 * @throws App_Db_Exception_Table id department id is not specified or if root department is missing
	 */
	public function deleteDepartment($id)
	{
		if(empty($id))
        	throw new App_Db_Exception_Table('Department ID is not specified');
        
        $root = $this->getRootDepartment();
        if(null === $root)
        	throw new App_Db_Exception_Table('ROOT department does not exist');
        
		Table_Log::insert_deleted($this->_table, $id, 'id');
		$this->db_delete($this->_table, array('id'=>$id));
		
		$this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'num', $root['id'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}



