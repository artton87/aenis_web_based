<?php
/**
 * Rates management
 * @package aenis\Classifiers
 */

/**
 * Contains methods for Rates management
 * @author BestSoft
 * @package aenis\Classifiers
 */
class Rates extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'rates';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'rates';


	/**
	 * Returns list of rates
	 * @access public
	 * @param array $search     Associative array with search parameters
	 * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
	 * @return mysqli_result
	 */
	public function getRates(array $search = array(), $lang_ids = array())
	{
		$where = array();
		$joins = array(
			'LEFT JOIN bs_transaction_types tr_types ON tr_types.id = tbl.tr_type_id',
			'LEFT JOIN bs_transaction_types_content tr_types_content ON tr_types.id = tr_types_content.tr_type_id',
			'LEFT JOIN bs_subject_inheritor_types subject_inheritor_types ON subject_inheritor_types.id = tbl.inheritor_type_id'
		);

		if(!empty($search['id']))
			$where[] = 'tbl.id = '.intval($search['id']);
		if(!empty($search['tr_type_id']))
			$where[] = 'tbl.tr_type_id = "'.$search['tr_type_id'].'"';
		foreach($lang_ids as &$_lang_id)
			$_lang_id = intval($_lang_id);
		//$lang_id_condition = empty($lang_ids) ? '' : 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';
		if($lang_ids){
			$joins[] = "LEFT JOIN bs_transaction_types_content tbl_content ON tbl.tr_type_id = tbl.tr_type_id";
			$where[] = 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';
		}
		$where[] = ' tr_types_content.lang_id = 1';

		$where = (count($where)>0) ? ' WHERE '.implode(' AND ', $where) : '';
		//$where = implode(' AND ', array_unique($where));
		$joins = implode(PHP_EOL, array_unique($joins));

		$q = "SELECT
				tbl.*,
				tr_types_content.label AS tr_type_label,
				subject_inheritor_types.label AS inheritor_type_label
        	FROM bs_{$this->_table} tbl
        	$joins
			$where
			ORDER BY id
			#LIMIT 2
        ";
		//Logger::logDebugInformation($q);
		return $this->db_query($q);
	}




	/**
	 * Checks correctness of rate input fields
	 * @access public
	 * @param array $data    Associative array with 'rates' database table field values
	 * @param integer $id    Rate ID
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
	 */
	protected function validateRate($data, $id=0)
	{
		if(empty($data['tr_type_id']))
			throw new App_Db_Exception_Validate('Դրույքաչափի գործարքի տեսակը տրված չէ');

		$where = array('tr_type_id'=>$data['tr_type_id']);
		if(!empty($id))
			$where[] = 'id <>'.intval($id);

		$result = $this->db_select($this->_table, array('id'), $where);
		if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Տվյալ անվանումով դրույքաչափի արդեն մուտքագրված է');
	}


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with rate fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'tr_type_id' => $data['tr_type_id'],
			'parcel_purpose_type_id' => $data['parcel_purpose_type_id'] ? $data['parcel_purpose_type_id'] : self::$DB_NULL,
			'building_type_id' => $data['building_type_id'] ? $data['building_type_id'] : self::$DB_NULL,
			'inheritor_type_id' => $data['inheritor_type_id'] ? $data['inheritor_type_id'] : self::$DB_NULL,
			'state_fee_coefficient' => $data['state_fee_coefficient']
		);
	}


	/**
	 * Add new rate
	 * @access public
	 * @param array $data    Associative array with 'rates' database table field values
	 */
	function addRate($data)
	{
		$this->validateRate($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $this->db_insert_id();
	}


	/**
	 * Edit an existing rate
	 * @access public
	 * @param integer $id     rate ID
	 * @param array $data    Associative array with 'rates' database table field values
	 * @throws App_Db_Exception_Table if rate id is not specified
	 */
	function updateRate($id, $data)
	{

		if(empty($id))
			throw new App_Db_Exception_Table('Rate ID is not specified');
		//$this->validateRate($data, $id);
		//Logger::out($this->getDbFields($data));
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		// App_Cache()->refreshTags(self::CACHE_TAG);
	}


	/**
	 * Removes rate with the given ID
	 * @access public
	 * @param integer $id  Rate ID
	 * @throws App_Db_Exception_Table if rate id is not specified
	 */
	function deleteRate($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Rate ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
