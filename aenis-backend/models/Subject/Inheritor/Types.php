<?php
/**
 * Subject relation types management
 * @package aenis\Classifiers
 */

/**
 * Contains methods for subject inheritor types management
 * @author BestSoft
 * @package aenis\Classifiers
 */
class Subject_Inheritor_Types extends App_Db_Table_Abstract
{
    /**
     * Tag for cache entry
     */
    const CACHE_TAG = 'subject_inheritor_types';

    /**
     * Database table name
     * @var string
     */
    protected $_table = 'subject_inheritor_types';


    /**
     * Returns list of subject inheritor types
     * @access public
     * @param array $search     Associative array with search parameters
     * @return mysqli_result
     */
    public function getTypes(array $search = array())
    {
        $where = array();

        if(!empty($search['id']))
            $where[] = 'tbl.id = '.intval($search['id']);

        $where = (count($where)>0) ? ' WHERE '.implode(' AND ', $where) : '';

        $q = "SELECT
				tbl.*
        	FROM bs_{$this->_table} tbl
			$where
        ";
        return $this->db_query($q);
    }


    /**
     * Checks correctness of subject inheritor type input fields
     * @access public
     * @param array $data    Associative array with 'subject_inheritor_types' database table field values
     * @param integer $id    Subject relation type ID
     * @throws App_Db_Exception_Validate if some fields do not pass validation
     */
    protected function validateType($data, $id=0)
    {
        if(empty($data['label']))
            throw new App_Db_Exception_Validate('Ժառանգական կապի տեսակի անվանումը տրված չէ');

        $where = array('label'=>$data['label']);
        if(!empty($id))
            $where[] = 'id <>'.intval($id);

        $result = $this->db_select($this->_table, array('id'), $where);
        if($row = $this->db_fetch_array($result))
            throw new App_Db_Exception_Validate('Տվյալ անվանումով ժառանգական կապի տեսակ արդեն մուտքագրված է');
    }


    /**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with party type fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
        return array(
            'label' => $data['label']
        );
    }


    /**
     * Add new subject inheritor type
     * @access public
     * @param array $data    Associative array with 'subject_inheritor_types' database table field values
     */
    public function addType($data)
    {
        $this->validateType($data);
        $this->db_insert($this->_table, $this->getDbFields($data));
        App_Cache()->refreshTags(self::CACHE_TAG);
        return $this->db_insert_id();
    }


    /**
     * Edit an existing subject inheritor type
     * @access public
     * @param integer $id     Subject inheritor type ID
     * @param array $data    Associative array with 'subject_inheritor_types' database table field values
     * @throws App_Db_Exception_Table if subject inheritor type id is not specified
     */
    public function updateType($id, $data)
    {
        if(empty($id))
            throw new App_Db_Exception_Table('Subject inheritor type ID is not specified');

        $this->validateType($data, $id);
        $this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
        App_Cache()->refreshTags(self::CACHE_TAG);
    }


    /**
     * Removes subject inheritor type with the given ID
     * @access public
     * @param integer $id    Subject inheritor type ID
     * @throws App_Db_Exception_Table if subject inheritor type id is not specified
     */
    public function deleteType($id)
    {
        if(empty($id))
            throw new App_Db_Exception_Table('Subject inheritor type ID is not specified');

        $this->db_delete($this->_table, array('id'=>$id));
        App_Cache()->refreshTags(self::CACHE_TAG);
    }
}
