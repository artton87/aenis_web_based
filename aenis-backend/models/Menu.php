<?php
/**
 * Module menus and toolbars management
 * @package Sysadmin
 */

/**
 * Methods for working with module menus and toolbars
 * @author BestSoft
 * @package Sysadmin
 */
class Menu extends App_Db_Table_Abstract
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'menu';


	/**
	 * Utility function used to set initial LFT, RGT values
	 * @access private
	 * @param integer $app_id    Module ID
	 */
	private function repair($app_id)
	{
		$root = $this->getRootMenu($app_id);
		if(null === $root)
		{
			$this->addRootMenu($app_id);
			$root = $this->getRootMenu($app_id);
		}
		$this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'menu_order', $root['idd'], 1);
	}
	
	
	/**
     * Returns menu items
     * @access public
     * @param array $search    Associative array with search parameters
     * @param boolean $bUseToolbarOrder    Optional. Whenever to use toolbar ordering instead of menu ordering
     * @return mysqli_result|resource
     */
    public function getItems($search, $bUseToolbarOrder = false)
    {
    	$where = array();
    	
    	if(!empty($search['app_id']))
    		$where[] = 'menu.app_id='.intval($search['app_id']);
    	
    	if(!empty($search['menu_id']))
    		$where[] = 'menu.id='.intval($search['menu_id']);
    	
    	if(array_key_exists('is_enabled', $search))
    		$where[] = 'menu.is_enabled='.intval($search['is_enabled']);
    	
    	if(array_key_exists('has_toolbar_button', $search))
    		$where[] = 'menu.has_toolbar_button='.intval($search['has_toolbar_button']);
    		
    	if(!empty($search['parent_id']))
			$where[] = 'menu.parent_id='.intval($search['parent_id']);
    	
    	$where = 'WHERE '.implode(' AND ', $where);
    	
    	$q = "SELECT
    			id, app_id, title, parent_id, menu_order, command, is_enabled, has_menu_sep,
				has_toolbar_button, has_toolbar_sep, toolbar_order
        	FROM bs_menu menu
        	$where
        	ORDER BY ".($bUseToolbarOrder ? 'toolbar_order' : 'menu_order')."
    	";
    	
    	return $this->db_query($q);
    }
    
    
   /**
    * Returns module menus with their details as a tree
    * @access public
    * @param integer $app_id    Module ID
	* @param boolean $enabled_only    Optional. Whenever to return only enabled items
	* @param boolean $detailed    Optional. If true, returns all menu fields
    * @return mysqli_result|resource
    */
    public function getMenuTree($app_id, $enabled_only = false, $detailed = false)
    {
		$is_enabled = $enabled_only ? ' AND menu.is_enabled=1' : '';

		//this fields always should be selected
		$select_vec = array(
        	'menu.id', 'menu.title', 'menu.parent_id', 'menu.command', 'menu.resource_id',
			'menu.has_menu_sep', 'menu.has_toolbar_button', 'menu.has_toolbar_sep', 'menu.toolbar_order'
        );
		$select_join = array();

		if($detailed)
		{
			$select_vec = array_merge($select_vec, array(
				'menu.app_id', 'menu.menu_order',
				'menu.is_enabled', 'parent_menu.title AS parent_title'
			));
			$select_join = array_merge($select_join, array(
				'LEFT JOIN bs_menu parent_menu ON parent_menu.id = menu.parent_id'
			));
		}
        
        $select_cols = ', '.implode(',', $select_vec);
		$select_null = str_repeat(', 0', count($select_vec));
		$select_join = implode(' ', $select_join);
        
        //query variables to include only descendants of given member in select query
		$row = $this->getRootMenu($app_id);
		if(null === $row) return FALSE;
		$root_lft = $row['lft']+1; //don't include invisible root
        $root_rgt = $row['rgt']-1; //don't include invisible root
        
        // main query should be constructed to keep this formula true:
        // (record count of 2nd SELECT) = (record count of 1st SELECT) - (record count of 1st SELECT with xml_tag=1)
        $q = "
            (
               SELECT menu.lft as n, menu.rgt-menu.lft as xml_tag $select_cols
               FROM bs_menu menu
               $select_join
               WHERE (menu.lft BETWEEN $root_lft AND $root_rgt) AND menu.app_id = ".intval($app_id)." $is_enabled
            )
            UNION ALL 
            (
               SELECT menu.rgt as n, 0 as xml_tag $select_null
               FROM bs_menu menu
               WHERE (menu.lft BETWEEN $root_lft AND menu.rgt-2) AND menu.rgt<=$root_rgt AND menu.app_id = ".intval($app_id)." $is_enabled
            )
            ORDER BY n
        ";
        return $this->db_query($q);
    }
    
    
    /**
     * Returns details of menus matching to given search criteria
     * @access public
     * @param array $search     Associative array with search parameters
     * @return mysqli_result|resource
     */
    public function getMenus(array $search)
    {
    	$where = array();
    	
    	if(!empty($search['menu_id']))
    		$where[] = 'menu.id = '.intval($search['menu_id']);
        
        $where = (count($where)>0) ? ' WHERE '.implode(' AND ', $where) : '';
    	
        $q = "SELECT 
				id, app_id, title, parent_id, menu_order, command, is_enabled, has_menu_sep,
				has_toolbar_button, has_toolbar_sep, toolbar_order, resource_id
        	FROM bs_menu menu
			$where
			ORDER BY menu.id
        ";
    	return $this->db_query($q);
    }
    
    
    /**
     * Returns details of ROOT menu
     * @access protected
     * @param integer $app_id    Module ID
     * @return array    Associative array with 'idd','lft','rgt' fields, or null
     */
    public function getRootMenu($app_id)
    {
		$result = $this->db_select(
			$this->_table,
			array('id'=>'idd', 'lft','rgt'),
			array('ISNULL(parent_id)', 'app_id'=>$app_id)
		);
        if($row = $this->db_fetch_array($result))
        {
			return $row;
        }
        return null;
    }


	/**
	 * Adds ROOT menu. All menus have parent menu, except of this one
	 * @access protected
	 * @param integer $app_id    Module ID
	 * @throws App_Db_Exception_Table if application id is not specified
	 */
    protected function addRootMenu($app_id)
    {
    	if(empty($app_id))
        	throw new App_Db_Exception_Table('Մենյուի մոդուլը նշված չէ:');
        	
		$insert_data = array(
        	'parent_id' => self::$DB_NULL,
        	'app_id' => $app_id,
        	'title' => 'ROOT'
        );
        $this->db_insert($this->_table, $insert_data);
    }


	/**
	 * Checks menu fields
	 * @access protected
	 * @param integer $menu_id    Menu ID
	 * @param array $data   Associative array with fields as of 'menu' table in database
	 * @param array $root    Value returned from Menu::getRootMenu() function
	 * @throws App_Db_Exception_Validate on some fields do not pass valdiation
	 * @see Menu::getRootMenu()
	 */
    protected function validateMenu($menu_id, $data, $root)
    {
    	if(empty($data['title']))
        	throw new App_Db_Exception_Validate('Մենյուի անվանումը նշված չէ:');
        	
    	if(!empty($menu_id))
        {
        	$result = $this->db_select($this->_table, array('lft','rgt'), array('id'=>$menu_id));
        	$row = $this->db_fetch_array($result);
        	$member_lft = $row['lft'];
        	$member_rgt = $row['rgt'];
        	
        	$result = $this->db_select(
        		$this->_table, array('id'),
        		array(
        			$member_lft.' <= lft',
        			'lft < '.$member_rgt,
        			'id' => empty($data['parent_id']) ? $root['idd'] : $data['parent_id'],
        			'app_id' => $data['app_id']
        		)
        	);
        	if($row = $this->db_fetch_array($result))
        	{
				throw new App_Db_Exception_Validate('Մենյուն չի կարող հանդիսանալ ինքն իր ենթամենյուն');
        	}
		}
    }


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with menu fields
	 * @param array $root    Associative array with 'idd','lft','rgt' fields of root record
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data, $root)
	{
		return array(
			'app_id' => $data['app_id'],
			'resource_id' => empty($data['resource_id']) ? self::$DB_NULL : $data['resource_id'],
			'title' => $data['title'],
			'parent_id' => empty($data['parent_id']) ? $root['idd'] : $data['parent_id'],
			'has_menu_sep' => $data['has_menu_sep'],
			'menu_order' => $data['menu_order'],
			'is_enabled' => $data['is_enabled'] ? 1 : 0,
			'command' => $data['command'],
			'has_toolbar_button' => $data['has_toolbar_button'] ? 1 : 0,
			'has_toolbar_sep' => $data['has_toolbar_sep'] ? 1 : 0,
			'toolbar_order' => $data['toolbar_order']
		);
	}

    
    /**
     * Add new menu item
     * @access public
     * @param array $data    Associative array with fields as of 'menu' table in database
     */
	public function addMenu($data)
	{
		$root = $this->getRootMenu($data['app_id']);
		if(null === $root)
		{
			$this->addRootMenu($data['app_id']);
			$root = $this->getRootMenu($data['app_id']);
		}
		$this->validateMenu(0, $data, $root);

        $this->db_insert($this->_table, $this->getDbFields($data, $root));
        $menu_id = $this->db_insert_id();
        
        $this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'menu_order', $root['idd'], 1);
		return $menu_id;
	}


	/**
	 * Updates given menu
	 * @access public
	 * @param integer $menu_id    Menu ID
	 * @param array $data    Associative array with fields as of 'menu' table in database
	 * @throws App_Db_Exception_Table if menu id is not specified or on ROOT menu issues
	 */
    public function updateMenu($menu_id, $data)
    {
        if(empty($menu_id))
        	throw new App_Db_Exception_Table('Menu ID is not specified');
        
        $root = $this->getRootMenu($data['app_id']);
        if(null === $root)
        	throw new App_Db_Exception_Table('ROOT menu cannot be found');
        
        if($menu_id == $root['idd'])
        	throw new App_Db_Exception_Table('Invalid menu ID. ROOT menu cannot be updated');
        
        $this->validateMenu($menu_id, $data, $root);

        $this->db_update($this->_table, $this->getDbFields($data, $root), array('id'=>$menu_id));

        //during update, root always is present, as it was added previously
        $this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'menu_order', $root['idd'], 1);
    }


	/**
	 * Remove given menu item
	 * @access public
	 * @param integer $id    Menu ID
	 * @throws App_Db_Exception_Table if menu is not specified
	 */
	public function deleteMenu($id)
	{
		if(empty($id))
        	throw new App_Db_Exception_Table('Menu ID is not specified');
        
        $result = $this->db_select($this->_table, array('app_id'), array('id'=>$id));
        if($row = $this->db_fetch_array($result))
        {
			$app_id = $row['app_id'];
        }
        else throw new App_Db_Exception_Table('Menu cannot be found');
        
        $root = $this->getRootMenu($app_id);
        if(null === $root)
        	throw new App_Db_Exception_Table('ROOT menu cannot be found');
        
        $this->db_delete($this->_table, array('id'=>$id));
		
		$this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'menu_order', $root['idd'], 1);
	}
}
