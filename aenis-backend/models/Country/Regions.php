<?php
/**
 * Regions management
 * @package aenis\Address
 */

/**
 * Methods for regions management
 * @author BestSoft
 * @package aenis\Address
 */
class Country_Regions extends App_Db_Table_Abstract
{
    /**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'region';

	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'loc_regions';



	/**
     * Returns list of regions with detailed information about them
     * @access public
     * @param array $search    Associative array with search parameters
	 * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
     * @return mysqli_result|resource
     */
    public function getRegions(array $search = array(), array $lang_ids = array())
    {
		$joins = array();
    	$where = array();
    	if(!empty($search['country_id']))
    		$where[] = "tbl.country_id='".intval($search['country_id'])."'";
    		
    	if(!empty($search['country_code']))
    	{
    		$joins[] = 'LEFT JOIN bs_loc_countries country ON country.id = tbl.country_id';
			$where[] = "country.code='".$this->db_escape_string($search['country_code'])."'";
    	}

		foreach($lang_ids as &$lang_id)
			$lang_id = intval($lang_id);
		$order = (1==count($lang_ids)) ? 'tbl.code ASC' : 'tbl.id ASC, tbl_content.lang_id ASC';
		$lang_id_condition = empty($lang_ids) ? '' : 'AND tbl_content.lang_id IN ('.implode(',',$lang_ids).')';

    	$where = empty($where) ? '' : 'WHERE '.implode(' AND ', $where);
    	$joins = empty($joins) ? '' : implode(' ', $joins);
    	
		$q = "SELECT
				tbl.*,
				tbl_content.name,
				tbl_content.lang_id
			FROM bs_{$this->_table} tbl
			LEFT JOIN bs_{$this->_table}_content tbl_content ON tbl_content.region_id = tbl.id $lang_id_condition
			$joins
			$where
			ORDER BY $order
		";
		return $this->db_query($q);
    }


	/**
	 * Validates region fields
	 * @access protected
	 * @param array $data   Associative array with region fields
	 * @param integer $region_id    Region ID
	 * @throws App_Db_Exception_Validate if some of fields do not pass validation
	 */
    protected function validateRegion($data, $region_id=0)
    {
    	if(empty($data['country_id']))
        	throw new App_Db_Exception_Validate('Երկիրը նշված չէ:');

		if(empty($data['code']))
			throw new App_Db_Exception_Validate('Մարզի կոդը նշված չէ:');

		$oLanguages = new Languages();
		$default_lang_id = $oLanguages->getDefaultLanguage()->id;
		if(empty($data['content'][$default_lang_id]['name']))
			throw new App_Db_Exception_Validate('Մարզի անվանումը լրացված չէ:');

		$region_condition = empty($region_id) ? '' : "AND tbl.id <> $region_id";

		$languages = $oLanguages->getLanguages();
		foreach($languages as $lang)
		{
			$input_name = $data['content'][$lang->id]['name'];
			if(empty($input_name)) continue; //skip languages, which are not filled in

			$q = "SELECT
					tbl.id
				FROM bs_{$this->_table} tbl
				JOIN bs_{$this->_table}_content tbl_content ON tbl_content.region_id = tbl.id
						AND tbl_content.lang_id = {$lang->id}
				WHERE tbl.country_id = ".intval($data['country_id'])." $region_condition
						AND tbl_content.name = '".$this->db_escape_string($input_name)."'
			";
			$result = $this->db_query($q);
			if($this->db_fetch_array($result))
				throw new App_Db_Exception_Validate('Մարզի անվանումը կրկնվում է "'.$lang->title.'" լեզվի համար:');
		}
    }
    
    
    /**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with region fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
		return array(
			'country_id' => $data['country_id'],
        	'code' => $data['code']
        );
    }
    
    
    /**
     * Adds new region
     * @access public
     * @param array $data    Associative array with region fields
	 * @return integer    ID of newly added record
     */
	public function addRegion($data)
	{
		$this->validateRegion($data);
		$this->db_insert($this->_table, $this->getDbFields($data));
		$id = $this->db_insert_id();
		$this->setRegionContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $id;
	}
	
	
	/**
     * Edit existing region
     * @access public
     * @param integer $id    Region ID
     * @param array $data    Associative array with region fields
	 * @throws App_Db_Exception_Table if region id is not specified
     */
    public function updateRegion($id, $data)
    {
        if(empty($id))
        	throw new App_Db_Exception_Table('Region ID is not specified');

		$this->validateRegion($data, $id);
		$this->db_update($this->_table, $this->getDbFields($data), array('id'=>$id));
		$this->setRegionContent($id, $data['content']);
		App_Cache()->refreshTags(self::CACHE_TAG);
    }


	/**
	 * Sets content for the region
	 * @access protected
	 * @param integer $id    Region id
	 * @param array $content_data    Associative array with 'loc_regions_content' database table field values
	 */
	protected function setRegionContent($id, array $content_data)
	{
		foreach($content_data as $lang_id=>$data)
		{
			$data = array(
				'name' => $data['name']
			);
			$where = array('lang_id'=>$lang_id, 'region_id'=>$id);
			$result = $this->db_select($this->_table.'_content', array('lang_id'), $where);
			if($this->db_fetch_row($result))
			{
				$this->db_update($this->_table.'_content', $data, $where);
			}
			else
			{
				$data['lang_id'] = $lang_id;
				$data['region_id'] = $id;
				$this->db_insert($this->_table.'_content', $data);
			}
		}
	}

	
	/**
	 * Deletes region with given ID
	 * @access public
	 * @param string $id    Region ID
	 * @throws App_Db_Exception_Table if region id is not specified
	 * @throws App_Exception_NonCritical if there are communities attached to that region and delete is impossible
	 */
	public function deleteRegion($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Region ID is not specified');

		$result = $this->db_select('loc_communities', array('id'), array('region_id'=>$id), array(), 1);
		if($this->db_fetch_row($result))
			throw new App_Exception_NonCritical('Մարզը հնարավոր չէ հեռացնել, քանի որ վերջինս պարունակում է համայնքներ:');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
