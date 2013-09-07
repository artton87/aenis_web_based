<?php
/**
 * Application modules management class
 * @package Sysadmin
 */

/**
 * Application modules management class
 * @author BestSoft
 * @package Sysadmin
 */
class Modules extends App_Db_Table_Abstract
{
	protected $_table = 'apps';


    /**
     * Returns list of modules
     * @access public
     * @param integer $app_id    Optional. If given, returns only application with that ID.
     * @param boolean $is_enabled    Optional. If given, returns only enabled/disabled applications.
     * @return mysqli_result|resource
     */
    public function getModules($app_id = 0, $is_enabled = null)
    {
    	$filter = array();
    	
    	if(!empty($app_id))
    		$filter['id'] = $app_id;
    	
    	if(null !== $is_enabled)
    		$filter['is_enabled'] = $is_enabled;
        
        return $this->db_select($this->_table, array(), $filter, array('app_order'));
    }


	/**
	 * Checks correctness of module input fields
	 * @access public
	 * @param array $data    Associative array with 'apps' database table field values
	 * @param integer $id    Resource ID
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
	 */
	protected function validateModule($data, $id=0)
	{
		if(empty($data['title']))
			throw new App_Db_Exception_Validate('Մոդուլի անվանումը տրված չէ');

		if(empty($data['module']))
			throw new App_Db_Exception_Validate('Մոդուլի կոդը տրված չէ');

		$CodeArr = array('module'=>$data['module']);
		$NameArr = array('title'=>$data['title']);

		if(!empty($id))
		{
			$CodeArr[] = 'id <>'.intval($id);
			$NameArr[] = 'id <>'.intval($id);
		}

		$result = $this->db_select($this->_table, array('id'), $CodeArr);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ կոդով մոդուլ արդեն մուտքագրված է');

		$result = $this->db_select($this->_table, array('id'), $NameArr);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ անունով մոդուլ արդեն մուտքագրված է');
	}


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with module fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'title' => $data['title'],
			'description' => $data['description'],
			'app_order' => $data['app_order'],
			'is_enabled' => $data['is_enabled'] ? 1 : 0,
			'resource_id' => empty($data['resource_id']) ? self::$DB_NULL : $data['resource_id'],
			'module' => $data['module']
		);
	}


	/**
	 * Add new resource
	 * @access public
	 * @param array $data    Associative array with 'apps' database table field values
	 */
	function addModule($data)
	{
		$this->validateModule($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		return $this->db_insert_id();
	}


	/**
	 * Edit an existing module
	 * @access public
	 * @param integer $id     Module ID
	 * @param array $data    Associative array with 'apps' database table field values
	 * @throws App_Db_Exception_Table if module id is not specified
	 */
	function updateModule($id, $data)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Module ID is not specified');

		$this->validateModule($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
	}


	/**
	 * Removes module with the given ID
	 * @access public
	 * @param integer $id    Module ID
	 * @throws App_Db_Exception_Table if module id is not specified
	 */
	function deleteModule($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Module ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
	}
}
