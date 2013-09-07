<?php
/**
 * Region communities management
 * @package aenis\Address
 */

/**
 * Methods for region communities management
 * @author BestSoft
 * @package aenis\Address
 */
class Country_Region_Communities extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'communities';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'loc_communities';


	/**
     * Returns list of communities with detailed information about them
     * @access public
     * @param array $search    Associative array with search parameters
	 * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
     * @return mysqli_result|resource
     */
    public function getCommunities(array $search = array(), array $lang_ids = array())
    {
		$where = array();
		if(!empty($search['region_id']))
			$where[] = "tbl.region_id='".intval($search['region_id'])."'";

		foreach($lang_ids as &$lang_id)
			$lang_id = intval($lang_id);
		$order = (1==count($lang_ids)) ? 'tbl_content.name ASC' : 'tbl.id ASC, tbl_content.lang_id ASC';
		$lang_id_condition = empty($lang_ids) ? '' : 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';

		$where = empty($where) ? '' : 'WHERE '.implode(' AND ', $where);

		$q = "SELECT
				tbl.*,
				tbl_content.name,
				tbl_content.lang_id
			FROM bs_{$this->_table} tbl
			LEFT JOIN bs_{$this->_table}_content tbl_content ON tbl_content.community_id = tbl.id $lang_id_condition
			$where
			ORDER BY $order
		";
		return $this->db_query($q);
    }
    
    
    /**
     * Validates community fields
     * @access protected
     * @param array $data   Associative array with community fields
	 * @param integer $community_id    Community ID
	 * @throws App_Db_Exception_Validate if some of fields do not pass validation
     */
    protected function validateCommunity($data, $community_id=0)
    {
		if(empty($data['region_id']))
			throw new App_Db_Exception_Validate('Մարզը նշված չէ:');

		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;
		if(empty($data['content'][$default_lang_id]['name']))
			throw new App_Db_Exception_Validate('Համայնքի անվանումը լրացված չէ:');

		$community_condition = empty($community_id) ? '' : "AND tbl.id <> $community_id";

		$languages = $oLanguages->getLanguages();
		foreach($languages as $lang)
		{
			$input_name = $data['content'][$lang->id]['name'];
			if(empty($input_name)) continue; //skip languages, which are not filled in

			$q = "SELECT
					tbl.id
				FROM bs_{$this->_table} tbl
				JOIN bs_{$this->_table}_content tbl_content ON tbl_content.community_id = tbl.id
						AND tbl_content.lang_id = {$lang->id}
				WHERE tbl.region_id = ".intval($data['region_id'])." $community_condition
						AND tbl_content.name = '".$this->db_escape_string($input_name)."'
			";
			$result = $this->db_query($q);
			if($this->db_fetch_array($result))
				throw new App_Db_Exception_Validate('Համայնքի անվանումը կրկնվում է "'.$lang->title.'" լեզվի համար:');
		}
    }
    
    
	/**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with community fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
		return array(
        	'region_id' => $data['region_id'],
        	'is_urban' => $data['is_urban'] ? 1 : 0
        );
    }
    
    
    /**
     * Adds new community
     * @access public
     * @param array $data    Associative array with community fields
     */
	public function addCommunity($data)
	{
		$this->validateCommunity($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		$id = $this->db_insert_id();
		$this->setCommunityContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $id;
	}
	
	
	/**
     * Edit existing community
     * @access public
     * @param integer $id    Community ID
     * @param array $data    Associative array with community fields
	 * @throws App_Db_Exception_Table if community id is not specified
     */
    public function updateCommunity($id, $data)
    {
        if(empty($id))
        	throw new App_Db_Exception_Table('Համայնքի նույնացման համարը տրված չէ');

		$this->validateCommunity($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		$this->setCommunityContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
    }


	/**
	 * Sets content for the community
	 * @access protected
	 * @param integer $id    Community id
	 * @param array $content_data    Associative array with 'loc_communities_content' database table field values
	 */
	protected function setCommunityContent($id, array $content_data)
	{
		foreach($content_data as $lang_id=>$data)
		{
			$data = array(
				'name' => $data['name']
			);
			$where = array('lang_id'=>$lang_id, 'community_id'=>$id);
			$result = $this->db_select($this->_table.'_content', array('lang_id'), $where);
			if($this->db_fetch_row($result))
			{
				$this->db_update($this->_table.'_content', $data, $where);
			}
			else
			{
				$data['lang_id'] = $lang_id;
				$data['community_id'] = $id;
				$this->db_insert($this->_table.'_content', $data);
			}
		}
	}


	/**
	 * Deletes community with given ID
	 * @access public
	 * @param string $id    Community ID
	 * @throws App_Db_Exception_Table if community id is not specified
	 */
	public function deleteCommunity($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Community ID is not specified');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
