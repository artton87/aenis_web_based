<?php
/**
 * Template variables management
 * @package aenis
 */

/**
 * Methods for working with template variables
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variables extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'template_variables';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'template_vars';


	/**
	 * Cached map of variable ids and codes
	 * @var array
	 */
	protected static $_factory_cache = array();


	/**
	 * Returns an instance of template variable class by variable code or by variable id.
	 * @param integer|string $variable    Variable code or id. Passing code will work faster.
	 * @throws App_Exception if valid class cannot be instantiated
	 * @return Template_IVariable    A class which implements IVariable interface
	 */
	public static function factory($variable)
	{
		if(empty($variable))
			throw new App_Exception("Neither variable code nor id has been specified.");

		$variable_code = $variable;
		if(is_numeric($variable) && (string)intval($variable) === (string)$variable)
		{
			$variable = intval($variable);
			if(isset(self::$_factory_cache[$variable])) //if exists in cache, return it
			{
				$variable_code = self::$_factory_cache[$variable];
			}
			else //otherwise do query to get the code
			{
				$oTemplateVars = new self();
				$result = $oTemplateVars->db_select('template_vars', array('code'), array('id'=>$variable));
				if($row = $oTemplateVars->db_fetch_row($result))
				{
					$variable_code = $row[0];
				}
				if(empty($variable_code))
					throw new App_Exception("Variable code cannot be found or is not set for variable #$variable");

				//code is found and is valid, store in cache to speed up factory() calls with same variable id
				self::$_factory_cache[$variable] = $variable_code;
			}
		}

		//get variable class name
		$variable_code = self::cleanupVariableCode($variable_code);
		$variable_code = str_replace('_', ' ', $variable_code);
		$variable_code = ucwords($variable_code);
		$variable_code = str_replace(' ', '_', $variable_code);
		if(empty($variable_code))
			throw new App_Exception("Invalid code for variable #$variable");
		$variable_code = 'Template_Variable_'.$variable_code;

		//check if class implements IVariable
		$interfaces = class_implements($variable_code, true);
		if(!isset($interfaces['Template_IVariable']))
			throw new App_Exception("Class $variable_code found for variable #$variable does not implement IVariable interface");

		$class = new ReflectionClass($variable_code);
		if(!$class->IsInstantiable())
			throw new App_Exception("Class $variable_code found for variable #$variable could not be instantiated due to its definition");

		return (new $variable_code);
	}


	/**
	 * Cleans given variable code by removing disallowed characters.
	 * Variable code should start with letter and contain only letters a-z, digits 0-9, and '_' character.
	 * @access public
	 * @param string $variable_code    Variable code
	 * @return string    Valid variable code or empty string
	 */
	public static function cleanupVariableCode($variable_code)
	{
		$variable_code = preg_replace('/^[^a-z]+/i', '', $variable_code);
		$variable_code = preg_replace('/[^a-z0-9]/i', '_', $variable_code);
		return $variable_code;
	}


	/**
	 * Returns details of template variable by the given id
	 * @access public
	 * @param integer $variable_id     Id of variable
	 * @return array
	 */
	public function getById($variable_id)
	{
		$result = $this->db_select($this->_table, array(), array('id'=>$variable_id));
		return $this->db_fetch_array($result);
	}


	/**
     * Returns details of template variables matching to given search criteria
     * @access public
     * @param array $search     Associative array with search parameters
     * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
     * @return mysqli_result|resource
     */
    public function getItems(array $search, array $lang_ids = array())
    {
    	$where = $joins = array();

    	if(!empty($search['variable_id']))
			$where[] = "tbl.id = '".intval($search['variable_id'])."'";

		if(!empty($search['doc_type_id']))
		{
			$doc_type_id = intval($search['doc_type_id']);
			$where[] = "(tbl.doc_type_id IS NULL OR tbl.doc_type_id = $doc_type_id)";
		}

		if(!empty($search['tr_type_id']))
		{
			$tr_type_id = intval($search['tr_type_id']);
			$where[] = "(tbl.doc_type_id IS NULL OR tr_types.id = '$tr_type_id')";
			$joins[] = 'LEFT JOIN bs_transaction_types tr_types ON tr_types.id = doc_types.tr_type_id';
		}

		if(!empty($search['doc_type_code']))
			$where[] = "(tbl.doc_type_id IS NULL OR tbl.doc_type_id = getDocumentTypeIdByCode(
				'".$this->db_escape_string($search['doc_type_code'])."'
			))";
        
        $where = empty($where) ? '' : ' WHERE '.implode(' AND ', $where);
		$joins = empty($joins) ? '' : implode(PHP_EOL, $joins);

        foreach($lang_ids as &$lang_id)
            $lang_id = intval($lang_id);
        $lang_id_condition = empty($lang_ids) ? '' : 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';

        $q = "SELECT 
				tbl.*,
				doc_types_content.label AS doc_type_label
        	FROM bs_{$this->_table} tbl
        	LEFT JOIN bs_document_types doc_types ON doc_types.id = tbl.doc_type_id
        	LEFT JOIN bs_document_types_content doc_types_content ON doc_types.id = doc_types_content.doc_type_id $lang_id_condition
        	$joins
			$where
			ORDER BY doc_types.id, tbl.code ASC
        ";
    	return $this->db_query($q);
    }
    
    
	/**
	 * Checks template variable fields
	 * @access protected
	 * @param integer $id    Template variable ID
	 * @param array $data   Associative array with fields as of 'template_vars' table in database
	 * @throws App_Db_Exception_Validate on some fields do not pass validation
	 */
    protected function validateItem($id, $data)
    {
		if(empty($data['title']))
        	throw new App_Db_Exception_Validate('Փոփոխականի անվանումը նշված չէ:');

		if(!empty($data['is_dynamic']))
		{
			if(empty($data['code']))
				throw new App_Db_Exception_Validate('Փոփոխականի կոդը նշված չէ:');

			$code = mb_strtolower($data['code']);
			if(0 === mb_strpos($code, 'abstract') || 0 === mb_strpos($code, 'argument'))
			{
				throw new App_Db_Exception_Validate('Փոփոխականի կոդը չի կարող պարունակել abstract ու argument բառերը:');
			}

			$where = array('code'=>$data['code']);
			if(!empty($id))
				$where[] = 'id <>'.intval($id);

			$result = $this->db_select($this->_table, array('id'), $where);
			if($row = $this->db_fetch_array($result))
				throw new App_Db_Exception_Validate('Տվյալ կոդով փոփոխական արդեն մուտքագրված է');
		}
    }


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with template variable fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'doc_type_id' => empty($data['doc_type_id']) ? self::$DB_NULL : $data['doc_type_id'],
			'is_dynamic' => $data['is_dynamic'] ? 1 : 0,
			'title' => $data['title'],
			'code' => $data['code'],
			'content' => empty($data['content']) ? self::$DB_NULL : $data['content']
		);
	}

    
    /**
     * Add new template variable
     * @access public
     * @param array $data    Associative array with fields as of 'template_vars' table in database
	 * @return integer    ID of newly added record
     */
	public function addItem($data)
	{
		$this->validateItem(0, $data);
        $this->db_insert($this->_table, $this->getDbFields($data));
		App_Cache()->refreshTags(self::CACHE_TAG);
        return $this->db_insert_id();
	}


	/**
	 * Updates given template variable
	 * @access public
	 * @param integer $id    Template variable ID
	 * @param array $data    Associative array with fields as of 'template_vars' table in database
	 * @throws App_Db_Exception_Table if template variable id is not specified
	 */
    public function updateItem($id, $data)
    {
        if(empty($id))
        	throw new App_Db_Exception_Table('Item ID is not specified');
        
        $this->validateItem($id, $data);
        $this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
    }


	/**
	 * Remove given template variable
	 * @access public
	 * @param integer $id    Template variable ID
	 * @throws App_Db_Exception_Table if template variable id is not specified
	 */
	public function deleteItem($id)
	{
		if(empty($id))
        	throw new App_Db_Exception_Table('Item ID is not specified');

        $this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
