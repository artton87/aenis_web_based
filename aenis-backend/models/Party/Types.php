<?php
/**
 * Party types management
 * @package aenis\Classifiers
 */

/**
 * Contains methods for party types management
 * @author BestSoft
 * @package aenis\Classifiers
 */
class Party_Types extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'party_types';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'party_types';


	/**
     * Returns list of party types
     * @access public
	 * @param array $search     Associative array with search parameters
     * @return mysqli_result
     */
	public function getTypes(array $search = array())
	{
		$where = array();

		if(!empty($search['id']))
			$where[] = 'tbl.id = '.intval($search['id']);
        if(!empty($search['party_type_code']))
            $where[] = 'tbl.party_type_code = "'.$search['party_type_code'].'"';

		$where = (count($where)>0) ? ' WHERE '.implode(' AND ', $where) : '';

		$q = "SELECT
				tbl.*,
				tbl_content.label, tbl_content.lang_id
        	FROM bs_{$this->_table} tbl
        	LEFT JOIN bs_{$this->_table}_content tbl_content ON tbl.id = tbl_content.party_type_id
			$where
        ";
		return $this->db_query($q);
	}

    public function getTypePortal($tr_type_id, array $lang_ids = array()) // ?? change
    {
        foreach($lang_ids as &$_lang_id)
            $_lang_id = intval($_lang_id);
        $lang_id_condition = empty($lang_ids) ? '' : 'AND party_types_content.lang_id IN ('.implode(',',$lang_ids).')';
        $query = "
                  SELECT
                  party_types.party_type_code,
                  party_types_content.label,transaction_type_party_types.is_required FROM bs_party_types party_types
                  LEFT JOIN bs_party_types_content party_types_content ON party_types.id = party_types_content.party_type_id
                  LEFT JOIN bs_transaction_type_party_types transaction_type_party_types
                   ON transaction_type_party_types.party_type_id=party_types.id
                  WHERE transaction_type_party_types.tr_type_id='".intval($tr_type_id)."' $lang_id_condition
                  ORDER BY transaction_type_party_types.order_in_list";

		$return = array();
		$result  = $this->db_query($query);
		while($row = $this->db_fetch_array($result))
		{
			$return[] = $row;
		}
		return $return;
    }


	/**
	 * Checks correctness of party type input fields
	 * @access public
	 * @param array $data    Associative array with 'party_types' database table field values
	 * @param integer $id    Party type ID
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
	 */
	protected function validateType($data, $id=0)
	{
		$oLanguages = new Languages();
		$languages = $oLanguages->getLanguages();
		foreach($languages as $language)
		{
			if(empty($data['content'][$language->id]['label']))
				throw new App_Db_Exception_Validate('Տեսակի անվանումը նշված չէ '.mb_strtolower($language->title).' լեզվի համար:');
		}

		/*$where = array('label'=>$data['label']);
		if(!empty($id))
			$where[] = 'id <>'.intval($id);

		$result = $this->db_select($this->_table, array('id'), $where);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ անվանումով կողմի տեսակ արդեն մուտքագրված է');*/
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
			'party_type_code' => $data['party_type_code']
		);
	}


	/**
	 * Add new party type
	 * @access public
	 * @param array $data    Associative array with 'party_types' database table field values
	 */
	function addType($data)
	{
		$this->validateType($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		$id = $this->db_insert_id();
		$this->setItemContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $id;
	}


	/**
	 * Edit an existing party type
	 * @access public
	 * @param integer $id     Party type ID
	 * @param array $data    Associative array with 'party_types' database table field values
	 * @throws App_Db_Exception_Table if party type id is not specified
	 */
	function updateType($id, $data)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Party type ID is not specified');

		$this->validateType($data, $id);

		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		$this->setItemContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}

	/**
	 * Sets content for the transaction type
	 * @access protected
	 * @param integer $id    Party type ID
	 * @param array $content_data    Associative array with 'party_types_content' database table field values
	 */
	protected function setItemContent($id, array $content_data)
	{
		foreach($content_data as $lang_id=>$data)
		{
			$data = array(
				'label' => $data['label']
			);
			$where = array('lang_id'=>$lang_id, 'party_type_id'=>$id);
			$result = $this->db_select($this->_table.'_content', array('lang_id'), $where);
			if(NULL !== $this->db_fetch_row($result))
			{
				$this->db_update($this->_table.'_content', $data, $where);
			}
			else
			{
				$data['lang_id'] = $lang_id;
				$data['party_type_id'] = $id;
				$this->db_insert($this->_table.'_content', $data);
			}
		}
	}


	/**
	 * Removes party type with the given ID
	 * @access public
	 * @param integer $id    Party type ID
	 * @throws App_Db_Exception_Table if party type id is not specified
	 */
	function deleteType($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Party type ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}