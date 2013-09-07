<?php
/**
 * Templateս management
 * @package aenis
 */

/**
 * Methods for working with templateս
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Templates extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'templates';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'templates';


	/**
	 * Returns content, substituting values instead of variables
	 * @param string $content
	 * @param array $variable_data    Optional. Array with data, which will be passed to each variable class
	 * @return string    Resulting HTML
	 */
	public function getHTML($content, array $variable_data=array())
	{
		$replacement_data = array();

		//wrap content in XHTML, specifying encoding
		$content = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"
				\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">
			<html xmlns=\"http://www.w3.org/1999/xhtml\">
					 <head>
					 	<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"/>
					 	<title>dummy</title>
					 </head>
					 <body>$content</body>
			</html>
		";

		//normally, it should be no parse errors, since $content was previously tidied up with tinyMCE in client side
		//but, anyway, we use error suppression operator in order to not to break html generation process
		$doc = new DOMDocument();
		$doc->formatOutput = false;
		@$doc->loadHTML($content);

		$xpath = new DOMXPath($doc);
		$query = "//span[@data-id]";
		$entries = $xpath->query($query);
		foreach($entries as $entry)
		{
			$variable_id = $entry->getAttribute('data-id');
			$variable_args = $entry->getAttribute('data-args');
			$variable_key = $variable_id.'#'.(empty($variable_args) ? '' : $variable_args);
			if(isset($replacement_data[$variable_key]))
			{
				$variable_value = $replacement_data[$variable_key];
			}
			else
			{
				if(empty($variable_args))
				{
					$args = array();
				}
				else
				{
					$args = App_Json::decode($variable_args, true);
				}
				$oVariable = Template_Variables::factory($variable_id);
				$variable_value = $oVariable->getVariableValue($variable_id, $args, $variable_data);
				$replacement_data[$variable_key] = $variable_value;
			}

			if(!empty($variable_value))
			{
				$f = $doc->createDocumentFragment();
				if($result = @$f->appendXML($variable_value)) //appendXML() expects well-formed markup (XHTML)
				{
					if($f->hasChildNodes())
						$entry->parentNode->insertBefore($f, $entry);
				}
			}
			$entry->parentNode->removeChild($entry);
		}

		$html = $doc->saveXML($doc->documentElement->lastChild);
		$i = strpos($html, '<body>');
		if($i>=0)
			$html = substr($html, $i+strlen('<body>'));
		$i = strrpos($html, '</body>');
		if($i>=0)
			$html = substr($html, 0, $i);
		return $html;
	}


	/**
	 * Returns details of template matching to given search criteria
	 * @access public
	 * @param array $search     Associative array with search parameters
	 * @return mysqli_result|resource
	 */
	public function getItems(array $search)
	{
		$where = array(
			'tbl_dt.is_last = ' . ((isset($search['is_last']) && 0==$search['is_last']) ? '0' : '1'),
			'tbl.is_deleted = ' . ((isset($search['is_deleted']) && 1==$search['is_deleted']) ? '1' : '0')
		);
		$joins = array();

		if(!empty($search['template_id']))
			$where[] = 'tbl.id = '.intval($search['template_id']);

		if(!empty($search['doc_type_id']))
			$where[] = 'tbl.doc_type_id = '.intval($search['doc_type_id']);

		if(!empty($search['doc_type_code']))
			$where[] = "tbl.doc_type_id = getDocumentTypeIdByCode(
				'".$this->db_escape_string($search['doc_type_code'])."'
			)";

		if(!empty($search['tr_type_id']))
		{
			$tr_type_id = intval($search['tr_type_id']);
			$where[] = "(tbl.doc_type_id IS NULL OR tr_types.id = '$tr_type_id')";
			$joins[] = 'LEFT JOIN bs_document_types doc_types ON doc_types.id = tbl.doc_type_id';
			$joins[] = 'LEFT JOIN bs_transaction_types tr_types ON tr_types.id = doc_types.tr_type_id';
		}

		if(!App_Registry::get('temp_sn')->user_is_root) //root user sees all templates
		{
			if(Acl()->allowed('template.show_child_users_templates'))
			{
				$oStaff = new Staff();
				$staff_user_sub_select = $oStaff->getStaffsDescendantUsersQuery(App_Registry::get('temp_sn')->user_staffs);

				//show templates of child staff users, his own templates and common templates
				$where[] = "(
					(
						tbl.definer_user_id IS NULL
					)
					OR
					(
						tbl.definer_user_id IN $staff_user_sub_select
					)
				)";
			}
			else
			{
				//show his own templates and common templates
				$user_id = App_Registry::get('temp_sn')->user_id;
				$where[] = "((tbl.definer_user_id = $user_id) OR (tbl.definer_user_id IS NULL))";
			}
		}

		$where = implode(' AND ', $where);
		$joins = empty($joins) ? '' : implode(PHP_EOL, $joins);

		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;

		$detailed_select_fields = '';
		if($search['detailed'])
		{
			$detailed_select_fields = "
				tbl_dt.content,
			";
		}

		$q = "SELECT
				tbl.id,
				tbl.doc_type_id,
				tbl.definer_user_id,
				getUserFullName(tbl.definer_user_id, $default_lang_id) AS definer_user_full_name,
				tbl_dt.id AS dt_id,
				tbl_dt.title,
				$detailed_select_fields
				tbl.is_deleted, tbl_dt.is_last
        	FROM bs_{$this->_table} tbl
        	JOIN bs_{$this->_table}_dt tbl_dt ON tbl_dt.template_id = tbl.id
        	$joins
			WHERE $where
			ORDER BY tbl_dt.title ASC
        ";
		return $this->db_query($q);
	}


	/**
	 * Checks template fields
	 * @access protected
	 * @param integer $id    Template ID
	 * @param array $data   Associative array with fields as of 'templates', 'templates_dt' tables in database
	 * @throws App_Db_Exception_Validate on some fields do not pass validation
	 */
	protected function validateItem($id, $data)
	{
		if(empty($data['doc_type_id']))
			throw new App_Db_Exception_Validate('Փաստաթղթի տեսակը նշված չէ:');

		if(empty($data['title']))
			throw new App_Db_Exception_Validate('Ձևի անվանումը նշված չէ:');

		if(empty($data['content']))
			throw new App_Db_Exception_Validate('Ձևի տեքստը նշված չէ:');

		$where = array(
			'tbl.is_deleted=0', 'tbl_dt.is_last=1',
			"tbl_dt.title='".$this->db_escape_string($data['title'])."'"
		);
		if(!empty($id))
			$where[] = 'tbl_dt.template_id <>'.intval($id);

		$where = implode(' AND ', $where);
		$q = "SELECT
				tbl.id
        	FROM bs_{$this->_table} tbl
        	JOIN bs_{$this->_table}_dt tbl_dt ON tbl_dt.template_id = tbl.id
			WHERE $where
			LIMIT 1
        ";
		$result = $this->db_query($q);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ անվանումով ձև արդեն մուտքագրված է');
	}


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param integer $id    Template ID
	 * @param array $data    Associative array with template fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($id, $data)
	{
		return array(
			'fields' => array(
				'doc_type_id' => $data['doc_type_id'],
				'definer_user_id' => empty($data['definer_user_id']) ? self::$DB_NULL : $data['definer_user_id'],
				'is_deleted' => 0,
				'lu_user_id' => App_Registry::get('temp_sn')->user_id,
				'lu_date' => self::$DB_TIMESTAMP
			),
			'dt_fields' => array(
				'template_id' => $id,
				'title' => $data['title'],
				'content' => $data['content'],
				'is_last' => 1,
				'lu_user_id' => App_Registry::get('temp_sn')->user_id,
				'lu_date' => self::$DB_TIMESTAMP
			),
		);
	}

    
    /**
     * Add new template
     * @access public
     * @param array $data    Associative array with fields as of 'templates', 'templates_dt' tables in database
	 * @return integer    ID of newly added record
     */
	public function addItem($data)
	{
		$this->validateItem(0, $data);

		$data = $this->getDbFields(0, $data);

        $this->db_insert($this->_table, $data['fields']);
		$id = $this->db_insert_id();

		$data['dt_fields']['template_id'] = $id;
		$this->db_insert($this->_table.'_dt', $data['dt_fields']);

		App_Cache()->refreshTags(self::CACHE_TAG);
        return $id;
	}


	/**
	 * Updates given template
	 * @access public
	 * @param integer $id    Template ID
	 * @param array $data    Associative array with fields as of 'templates', 'templates_dt' tables in database
	 * @throws App_Db_Exception_Table if template id is not specified
	 */
    public function updateItem($id, $data)
    {
        if(empty($id))
        	throw new App_Db_Exception_Table('Item ID is not specified');
        
        $this->validateItem($id, $data);

		$data = $this->getDbFields($id, $data);
		$this->db_update($this->_table,
			array('definer_user_id' => $data['fields']['definer_user_id']),
			array('id' => $id)
		);

		$this->db_update(
			$this->_table.'_dt',
			array('is_last' => 0),
			array('template_id' => $id, 'is_last' => 1)
		);
		$this->db_insert($this->_table.'_dt', $data['dt_fields']);

        App_Cache()->refreshTags(self::CACHE_TAG);
    }


	/**
	 * Remove given template
	 * @access public
	 * @param integer $id    Template ID
	 * @throws App_Db_Exception_Table if template id is not specified
	 */
	public function deleteItem($id)
	{
		if(empty($id))
        	throw new App_Db_Exception_Table('Item ID is not specified');

		$this->db_update(
			$this->_table,
			array(
				'is_deleted' => 1,
				'lu_user_id' => App_Registry::get('temp_sn')->user_id,
				'lu_date' => self::$DB_TIMESTAMP
			),
			array('id' => $id)
		);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
