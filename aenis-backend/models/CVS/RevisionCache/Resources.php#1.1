<?php
/**
 * Resources management
 * @package Sysadmin\Permissions
 */

/**
 * Methods and function for resource management
 * @author BestSoft
 * @package Sysadmin\Permissions
 */
class Resources extends App_Db_Table_Abstract
{
	protected $_table = 'resources';


	/**
	 * Type for menu resources
	 */
	const TYPE_MENU = 'menu';

	/**
	 * Type for permission resources
	 */
	const TYPE_PERMISSION = 'permission';

	/**
	 * Type for module resources
	 */
	const TYPE_MODULE = 'module';


	/**
	 * Returns list of resources
	 * @access public
	 * @param array $search_params    Associative array with search parameters
	 * @return mysqli_result|resource
	 */
	public function getResources($search_params = array())
	{
		$where = array();
		if(!empty($search_params['resource_id']))
			$where['id'] = $search_params['id'];

		if(!empty($search_params['types']))
		{
			foreach($search_params['types'] as &$type)
				$type = "'".$this->db_escape_string($type)."'";
			$where[] = 'type IN ('.implode(',', $search_params['types']).')';
		}

		if($search_params['strict'])
		{
			if(!empty($search_params['title']))
				$where['title'] = $search_params['title'];
			if(!empty($search_params['code']))
				$where['code'] = $search_params['code'];
		}
		else
		{
			if(!empty($search_params['title']))
				$where[] = "title LIKE '%".$this->db_escape_string($search_params['title'])."'";
			if(!empty($search_params['code']))
				$where[] = "code LIKE '%".$this->db_escape_string($search_params['code'])."'";
		}

		return $this->db_select($this->_table, array(), $where);
	}


	/**
	 * Checks correctness of resource input fields
	 * @access public
	 * @param array $data    Associative array with 'resources' database table field values
	 * @param integer $id    Resource ID
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
	 */
    protected function validateResource($data, $id=0)
    {
        if(empty($data['title']))
        	throw new App_Db_Exception_Validate('Ռեսուրսի անվանումը տրված չէ');
        
        if(empty($data['code']))
            throw new App_Db_Exception_Validate('Ռեսուրսի կոդը տրված չէ');

        $CodeArr = array('code'=>$data['code']);
        $NameArr = array('title'=>$data['title']);

        if(!empty($id))
        {
            $CodeArr[] = 'id <>'.intval($id);
            $NameArr[] = 'id <>'.intval($id);
        }
        
        $result = $this->db_select($this->_table, array('id'), $CodeArr);
        if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ կոդով ռեսուրս արդեն մուտքագրված է');
        
        $result = $this->db_select($this->_table, array('id'), $NameArr);
        if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ անունով ռեսուրս արդեն մուտքագրված է');
    }


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with resource fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'type' => $data['type'],
			'title' => $data['title'],
			'code' => $data['code'],
			'is_root_resource' => $data['is_root_resource'] ? 1 : 0
		);
	}


	/**  
	 * Add new resource
	 * @access public
	 * @param array $data    Associative array with 'resources' database table field values
	*/
	function addResource($data)
	{
        $this->validateResource($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		return $this->db_insert_id();
    }


	/**
     * Edit an existing resource
     * @access public
     * @param integer $id     Resource ID
     * @param array $data    Associative array with 'resources' database table field values
	 * @throws App_Db_Exception_Table if resource id is not specified
     */
	function updateResource($id, $data)
	{
		if(empty($id)) 
            throw new App_Db_Exception_Table('Resource ID is not specified');
		
        $this->validateResource($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
	}


	/**
	 * Removes resource with the given ID
	 * @access public
	 * @param integer $id    Resource ID
	 * @throws App_Db_Exception_Table if resource id is not specified
	 */
	function deleteResource($id)
	{
	    if(empty($id)) 
            throw new App_Db_Exception_Table('Resource ID is not specified');
		
		$this->db_delete($this->_table, array('id'=>$id));
	}
}
