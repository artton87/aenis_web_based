<?php
/**
 * Transaction types management
 * @package aenis
 */

/**
 * Contains methods for transaction types management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Types extends App_Db_Table_Abstract
{
	/**
	 * Transaction type id for warrants
	 */
	const TRANSACTION_TYPE_WARRANT = 79;

	/**
	 * Transaction type id for wills
	 */
	const TRANSACTION_TYPE_WILL = 61;
    /**
	 * Transaction type id for inheritance by law
	 */
	const TRANSACTION_TYPE_INHERITANCE_BY_LAW = 80;


    /**
     * Transaction type id for inheritance by will
     */
    const TRANSACTION_TYPE_INHERITANCE_BY_WILL = 60;

    /**
     * Transaction type id for inheritance of property preservation measures
     */
    const TRANSACTION_TYPE_INHERITANCE_PROPERTY = 63;

	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'transaction_types';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'transaction_types';


	/**
	 * Returns transaction types with their details as a tree
	 * @access public
	 * @param array $search    Optional. Array with some (or all) of the following search criteria:
	 * 							 visible_only - Whenever to return only visible items. Defaults to FALSE.
	 * 							 ui_type - A value of ui_type field as in transaction_types DB table.
	 * @param boolean $detailed    Optional. If true, returns all fields
	 * @return mysqli_result|resource
	 */

    public function getTemplateIdPortal($app_id)
    {
        //$query = "SELECT form_template FROM $this->_table WHERE id='$app_id'";
        $result = $this->db_select($this->_table, array('form_template'), array('id'=>$app_id));

        //$result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $return[] = $row['form_template'];
        }
        return $return[0];
    }

    /**
     * @param array $search
     * @param bool $detailed
     * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
     * @return bool
     */
    public function getItemsTree($search = array(), $detailed = false, array $lang_ids = array())
	{
		$filters = array();
		if($search['visible_only'])
			$filters[] = 'tbl.hidden=0';

		if(isset($search['ui_type']))
			$filters[] = "tbl.ui_type = '".$this->db_escape_string($search['ui_type'])."'";

		$filters = empty($filters) ? '' : 'AND '.implode(' AND ', $filters);

		//this fields always should be selected
		$select_vec = array(
			'tbl.id', 'tbl_content.lang_id', 'tbl_content.label', 'tbl.parent_id',
			'tbl.is_used_in_portal', 'tbl.service_fee_coefficient_min', 'tbl.service_fee_coefficient_max'
		);
		$select_join = array();

		if($detailed)
		{
			$oLanguages = new Languages();
			$default_lang_id = $oLanguages->getDefaultLanguage()->id;

			$select_vec = array_merge($select_vec, array(
				'tbl.order_in_list', 'tbl.form_template', 'tbl.hidden', 'tbl.ui_type',
				'parent_tbl_content.label AS parent_label'
			));
			$select_join = array_merge($select_join, array(
				'LEFT JOIN bs_'.$this->_table.' parent_tbl ON parent_tbl.id = tbl.parent_id',
				'LEFT JOIN bs_'.$this->_table.'_content parent_tbl_content ON parent_tbl_content.tr_type_id = parent_tbl.id AND parent_tbl_content.lang_id='.$default_lang_id
			));
		}

		$select_cols = ', '.implode(',', $select_vec);
		$select_null = str_repeat(', 0', count($select_vec));
		$select_join = implode(' ', $select_join);

		//query variables to include only descendants of given member in select query
		$row = $this->getRootItem();
		if(null === $row) return FALSE;
		$root_lft = $row['lft']+1; //don't include invisible root
		$root_rgt = $row['rgt']-1; //don't include invisible root

		foreach($lang_ids as &$_lang_id)
			$_lang_id = intval($_lang_id);
		$lang_id_condition = empty($lang_ids) ? '' : 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';

		// main query should be constructed to keep this formula true:
		// (record count of 2nd SELECT) = (record count of 1st SELECT) - (record count of 1st SELECT with xml_tag=1)
		$q = "
            (
               SELECT tbl.lft as n, tbl.rgt-tbl.lft as xml_tag $select_cols
               FROM bs_{$this->_table} tbl
               LEFT JOIN bs_{$this->_table}_content tbl_content ON tbl_content.tr_type_id = tbl.id $lang_id_condition
               $select_join
               WHERE (tbl.lft BETWEEN $root_lft AND $root_rgt) $filters
            )
            UNION ALL
            (
               SELECT tbl.rgt as n, 0 as xml_tag $select_null
               FROM bs_{$this->_table} tbl
               WHERE (tbl.lft BETWEEN $root_lft AND CAST(tbl.rgt AS SIGNED)-2) AND tbl.rgt<=$root_rgt $filters
            )
            ORDER BY n, id
        ";
        //echo $q;die;
		return $this->db_query($q);
	}


	/**
	 * Returns details of transaction types matching to given search criteria
	 * @access public
	 * @param array $search     Associative array with search parameters
	 * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
	 * @return mysqli_result|resource
	 */
	public function getItems(array $search, array $lang_ids = array())
	{
		$where = array();

		if(!empty($search['id']))
			$where[] = 'tbl.id = '.intval($search['id']);

		$where = (count($where)>0) ? ' WHERE '.implode(' AND ', $where) : '';

		foreach($lang_ids as &$lang_id)
			$lang_id = intval($lang_id);
		$lang_id_condition = empty($lang_ids) ? '' : 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';

		$q = "SELECT
				tbl.*,
				tbl_content.label,
				tbl_content.lang_id
        	FROM bs_{$this->_table} tbl
        	LEFT JOIN bs_{$this->_table}_content tbl_content ON tbl_content.tr_type_id = tbl.id $lang_id_condition
			$where
			ORDER BY tbl.order_in_list ASC
        ";
		return $this->db_query($q);
	}


	/**
	 * Returns details of ROOT item
	 * @access protected
	 * @return array    Associative array with 'idd','lft','rgt' fields, or null
	 */
	public function getRootItem()
	{
		$result = $this->db_select(
			$this->_table,
			array('id'=>'idd', 'lft','rgt'),
			array('ISNULL(parent_id)')
		);
		if($row = $this->db_fetch_array($result))
		{
			return $row;
		}
		return null;
	}


	/**
	 * Adds ROOT item. All items have parent item, except of this one
	 * @access protected
	 */
	protected function addRootItem()
	{
		$insert_data = array(
			'parent_id' => self::$DB_NULL
		);
		$this->db_insert($this->_table, $insert_data);
	}


	/**
	 * Checks transaction type fields
	 * @access protected
	 * @param integer $id    Transaction type ID
	 * @param array $data   Associative array with fields as of 'transaction_types' table in database
	 * @param array $root    Value returned from Transaction_Types::getRootItem() function
	 * @throws App_Db_Exception_Validate on some fields do not pass validation
	 * @see Document_Types::getRootItem()
	 */
	protected function validateItem($id, $data, $root)
	{
		$oLanguages = new Languages();
		$languages = $oLanguages->getLanguages();
		foreach($languages as $language)
		{
			if(empty($data['content'][$language->id]['label']))
				throw new App_Db_Exception_Validate('Տեսակի անվանումը նշված չէ '.mb_strtolower($language->title).' լեզվի համար:');
		}

		$min = abs(doubleval($data['service_fee_coefficient_min']));
		$max = abs(doubleval($data['service_fee_coefficient_max']));
		if($min>0 || $max>0)
		{
			if($min > $max)
				throw new App_Db_Exception_Validate('Նոտարի, ծառայության համար վճարի սահմանաչափերը սխալ են տրված');
		}

		if(!empty($id))
		{
			$result = $this->db_select($this->_table, array('lft','rgt'), array('id'=>$id));
			$row = $this->db_fetch_array($result);
			$member_lft = $row['lft'];
			$member_rgt = $row['rgt'];

			$result = $this->db_select(
				$this->_table, array('id'),
				array(
					$member_lft.' <= lft',
					'lft < '.$member_rgt,
					'id' => empty($data['parent_id']) ? $root['idd'] : $data['parent_id']
				)
			);
			if($row = $this->db_fetch_array($result))
			{
				throw new App_Db_Exception_Validate('Գրառումը չի կարող հանդիսանալ ինքն իր ստորադասը');
			}
		}
	}


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with transaction type fields
	 * @param array $root    Associative array with 'idd','lft','rgt' fields of root record
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data, $root)
	{
		return array(
			'parent_id' => empty($data['parent_id']) ? $root['idd'] : $data['parent_id'],
			'is_used_in_portal' => $data['is_used_in_portal'] ? 1 : 0,
			'order_in_list' => $data['order_in_list'],
			'hidden' => $data['hidden'] ? 1 : 0,
			'ui_type' => $data['ui_type'],
			'form_template' => empty($data['form_template']) ? self::$DB_NULL : $data['form_template'],
			'service_fee_coefficient_min' => empty($data['service_fee_coefficient_min']) ? self::$DB_NULL : $data['service_fee_coefficient_min'],
			'service_fee_coefficient_max' => empty($data['service_fee_coefficient_max']) ? self::$DB_NULL : $data['service_fee_coefficient_max']
		);
	}


	/**
	 * Add new transaction type
	 * @access public
	 * @param array $data    Associative array with fields as of 'transaction_types' table in database
	 */
	public function addItem($data)
	{
		$root = $this->getRootItem();
		if(null === $root)
		{
			$this->addRootItem();
			$root = $this->getRootItem();
		}
		$this->validateItem(0, $data, $root);

		$this->db_insert($this->_table, $this->getDbFields($data, $root));
		$id = $this->db_insert_id();
		$this->setItemContent($id, $data['content']);

		$this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'order_in_list', $root['idd'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $id;
	}


	/**
	 * Updates given transaction type
	 * @access public
	 * @param integer $id    Transaction type ID
	 * @param array $data    Associative array with fields as of 'transaction_types' table in database
	 * @throws App_Db_Exception_Table if transaction type id is not specified or on ROOT transaction type issues
	 */
	public function updateItem($id, $data)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Item ID is not specified');

		$root = $this->getRootItem();
		if(null === $root)
			throw new App_Db_Exception_Table('ROOT item cannot be found');

		if($id == $root['idd'])
			throw new App_Db_Exception_Table('Invalid item ID. ROOT item cannot be updated');

		$this->validateItem($id, $data, $root);

		$this->db_update($this->_table, $this->getDbFields($data, $root), array('id'=>$id));
		$this->setItemContent($id, $data['content']);

		//during update, root always is present, as it was added previously
		$this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'order_in_list', $root['idd'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}


	/**
	 * Sets content for the transaction type
	 * @access protected
	 * @param integer $id    Transaction type ID
	 * @param array $content_data    Associative array with 'transaction_types_content' database table field values
	 */
	protected function setItemContent($id, array $content_data)
	{
		foreach($content_data as $lang_id=>$data)
		{
			$data = array(
				'label' => $data['label']
			);
			$where = array('lang_id'=>$lang_id, 'tr_type_id'=>$id);
			$result = $this->db_select($this->_table.'_content', array('lang_id'), $where);
			if(NULL !== $this->db_fetch_row($result))
			{
				$this->db_update($this->_table.'_content', $data, $where);
			}
			else
			{
				$data['lang_id'] = $lang_id;
				$data['tr_type_id'] = $id;
				$this->db_insert($this->_table.'_content', $data);
			}
		}
	}


	/**
	 * Remove given transaction type
	 * @access public
	 * @param integer $id    Transaction type ID
	 * @throws App_Db_Exception_Table if transaction type id is not specified
	 */
	public function deleteItem($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Item ID is not specified');

		$root = $this->getRootItem();
		if(null === $root)
			throw new App_Db_Exception_Table('ROOT item cannot be found');

		$this->db_delete($this->_table, array('id'=>$id));

		$this->rebuild_lft_rgt_recurse($this->_table, 'id', 'parent_id', 'order_in_list', $root['idd'], 1);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
