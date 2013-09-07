<?php
/**
 * Notarial offices management
 * @package aenis\Classifiers
 */

/**
 * Contains methods for notarial offices management
 * @author BestSoft
 * @package aenis\Classifiers
 */
class NotarialOffices extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'notarial_offices';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'notarial_offices';


	/**
     * Returns list of notarial offices
     * @access public
	 * @param array $search     Associative array with search parameters
	 * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
     * @return mysqli_result
     */
	public function getOffices($search = array(), $lang_ids = array())
	{
		$search = (array)$search;
		$lang_ids = (array)$lang_ids;

		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;

		$where = array();

		if(!empty($search['id']))
			$where[] = 'tbl.id = '.intval($search['id']);

		if(!empty($search['available_for_user']))
		{
			$where[] = 'tbl.id IN (
				SELECT notarial_office_id
				FROM bs_staff_user su
				LEFT JOIN bs_staff staff ON staff.id = su.staff_id
				LEFT JOIN bs_departments dep ON dep.id = staff.dep_id
				WHERE su.is_active=1 AND su.user_id = '.intval($search['available_for_user']).'
			)';
		}

		$where = (count($where)>0) ? 'WHERE '.implode(' AND ', $where) : '';

		foreach($lang_ids as &$lang_id)
			$lang_id = intval($lang_id);
		$lang_id_condition = empty($lang_ids) ? '' : 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';

		$q = "SELECT
				tbl.id,
				tbl.longitude,
				tbl.latitude,
				tbl.community_id, comm_content.name AS community_title,
				region_content.region_id, region_content.name AS region_title,
				tbl.postal_index,
				tbl_content.address,
				tbl_content.lang_id
			FROM bs_{$this->_table} tbl
			LEFT JOIN bs_{$this->_table}_content tbl_content ON tbl_content.notarial_office_id = tbl.id $lang_id_condition
			LEFT JOIN bs_loc_communities comm ON comm.id = tbl.community_id
			LEFT JOIN bs_loc_communities_content comm_content ON comm_content.community_id = comm.id AND comm_content.lang_id = $default_lang_id
			LEFT JOIN bs_loc_regions_content region_content ON region_content.region_id = comm.region_id AND region_content.lang_id = $default_lang_id
			$where
			ORDER BY tbl.id ASC, tbl_content.lang_id ASC
        ";
		return $this->db_query($q);
	}


	/**
	 * Checks correctness of notarial office input fields
	 * @access public
	 * @param array $data    Associative array with 'notarial_offices' database table field values
	 * @param integer $id    Notarial office ID
	 * @throws App_Db_Exception_Validate if some fields do not pass validation
	 */
	protected function validateOffice($data, $id=0)
	{
		if($data['latitude'] < 38 || $data['latitude'] > 42)
			throw new App_Db_Exception_Validate('Գտնվելու վայլի լայնությունը սխալ է տրված');

		if($data['longitude'] < 43 || $data['longitude'] > 47)
			throw new App_Db_Exception_Validate('Գտնվելու վայլի երկայնությունը սխալ է տրված');

		if(empty($data['community_id']))
			throw new App_Db_Exception_Validate('Համայնքը նշված չէ');

		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;
		if(empty($data['content'][$default_lang_id]['address']))
			throw new App_Db_Exception_Validate('Հասցեն լրացված չէ');
	}


	/**
	 * Returns fields, which can be passed to database adapter's insert and update methods
	 * @access protected
	 * @param array $data    Associative array with notarial office fields
	 * @return array    Fields, which can be passed to database adapter methods
	 */
	protected function getDbFields($data)
	{
		return array(
			'latitude' => $data['latitude'],
			'longitude' => $data['longitude'],
			'community_id' => $data['community_id'],
			'postal_index' => $data['postal_index']
		);
	}


	/**
	 * Add new notarial office
	 * @access public
	 * @param array $data    Associative array with 'notarial_offices' database table field values
	 * @return integer    ID of newly added record
	 */
	function addOffice($data)
	{
		$this->validateOffice($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		$id = $this->db_insert_id();
		$this->setOfficeContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $id;
	}


	/**
	 * Edit an existing notarial office
	 * @access public
	 * @param integer $id     Notarial office ID
	 * @param array $data    Associative array with 'notarial_offices' database table field values
	 * @throws App_Db_Exception_Table if notarial office id is not specified
	 */
	function updateOffice($id, $data)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Notarial office ID is not specified');

		$this->validateOffice($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		$this->setOfficeContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
	}


	/**
	 * Sets content for the notarial office
	 * @access protected
	 * @param integer $id    Notarial office id
	 * @param array $content_data    Associative array with 'notarial_offices_content' database table field values
	 */
	protected function setOfficeContent($id, array $content_data)
	{
		foreach($content_data as $lang_id=>$data)
		{
			$data = array(
				'address' => $data['address']
			);
			$where = array('lang_id'=>$lang_id, 'notarial_office_id'=>$id);
			$result = $this->db_select($this->_table.'_content', array('lang_id'), $where);
			if(NULL !== $this->db_fetch_row($result))
			{
				$this->db_update($this->_table.'_content', $data, $where);
			}
			else
			{
				$data['lang_id'] = $lang_id;
				$data['notarial_office_id'] = $id;
				$this->db_insert($this->_table.'_content', $data);
			}
		}
	}


	/**
	 * Removes notarial office with the given ID
	 * @access public
	 * @param integer $id    Notarial office ID
	 * @throws App_Db_Exception_Table if notarial office id is not specified
	 * @throws App_Exception_NonCritical if there are departments attached to that office and delete is impossible
	 */
	function deleteOffice($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Notarial office ID is not specified');

		$result = $this->db_select('departments', array('id'), array('notarial_office_id'=>$id), array(), 1);
		if($row = $this->db_fetch_row($result))
			throw new App_Exception_NonCritical('Նոտարական գրասենյակը հնարավոր չէ հեռացնել, քանի որ նրան կան կցված ստորաբաժանումներ:');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
