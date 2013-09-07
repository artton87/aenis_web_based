<?php
/**
 * Countries management
 * @package aenis\Address
 */

/**
 * Methods for countries management
 * @author BestSoft
 * @package aenis\Address
 */
class Countries extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'country';
	
	/**
	 * Country code of country, which will be used by default
	 */
	const PRIMARY_COUNTRY_CODE = 'AM';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'loc_countries';

	
	/**
     * Returns list of foreign countries with detailed information about them
     * @access public
     * @param boolean $bOnlyPrimaryCountries    Optional. Whenever to return only primary countries
     * @param boolean $bOnlyForeignCountries    Optional. Whenever to return only foreign countries
     * @return mysqli_result|resource
     */
    public function getCountries($bOnlyPrimaryCountries = false, $bOnlyForeignCountries = false)
    {
		$where = '';
		if($bOnlyPrimaryCountries)
			$where = 'WHERE tbl.is_primary = 1';
		elseif($bOnlyForeignCountries)
			$where = 'WHERE tbl.is_primary = 0';

		$q = "SELECT
				tbl.*
			FROM (
				SELECT 
  					tbl_inner.*,
  					CASE WHEN code = '".self::PRIMARY_COUNTRY_CODE."' THEN 1 ELSE 0 END AS is_primary
  				FROM bs_{$this->_table} tbl_inner
			) tbl
			$where
			ORDER BY tbl.is_primary DESC, tbl.name ASC
		";
		return $this->db_query($q);
    }


	/**
	 * Returns default country details
	 * @access public
	 * @return object    An object with country details
	 */
	public function getDefaultCountry()
	{
		$result = $this->getCountries(true);
		if($row = $this->db_fetch_array($result))
		{
			return (object)$row;
		}
		return null;
	}
    
    
    /**
     * Validates country fields
     * @access protected
     * @param integer $country_id    Country ID
     * @param array $data   Associative array with country fields
	 * @throws App_Db_Exception_Validate is some of fields do not pass validation
     */
    protected function validateCountry($country_id, $data)
    {
        if(empty($data['name']))
        	throw new App_Db_Exception_Validate('Երկրի անվանումը լրացված չէ:');

        if(empty($data['code']))
        	throw new App_Db_Exception_Validate('Երկրի կոդը լրացված չէ:');
        	
        $where = array('name' => $data['name']);
        if(!empty($country_id))
        	$where[] = "id <> $country_id";
        $result = $this->db_select($this->_table, array('id'), $where, array(), 1);
        if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Երկրի անվանումը կրկնվում է:');
		
		$where = array('code' => $data['code']);
        if(!empty($country_id))
        	$where[] = "id <> $country_id";
        $result = $this->db_select($this->_table, array('id'), $where, array(), 1);
        if($row = $this->db_fetch_array($result))
			throw new App_Db_Exception_Validate('Երկրի կոդը կրկնվում է:');
    }
    
    
    /**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with country fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
		return array(
        	'name' => $data['name'],
        	'code' => $data['code']
        );
    }
    
    
    /**
     * Adds new country
     * @access public
     * @param array $data    Associative array with country fields
	 * @return integer    ID of newly added country
     */
	public function addCountry($data)
	{
		$this->validateCountry(0, $data);
        
        $insert_data = $this->getDbFields($data);
        
        $this->db_insert($this->_table, $insert_data);
		App_Cache()->refreshTags(self::CACHE_TAG);
		return $this->db_insert_id();
	}
	
	
	/**
     * Edit existing country
     * @access public
     * @param integer $country_id    Country ID
     * @param array $data    Associative array with country fields
	 * @throws App_Db_Exception_Table if country id is not specified
     */
    public function updateCountry($country_id, $data)
    {
        if(empty($country_id))
        	throw new App_Db_Exception_Table('Արտերկրի նույնացման համարը տրված չէ');
        $this->validateCountry($country_id, $data);
        
        $update_data = $this->getDbFields($data);

        $this->db_update($this->_table, $update_data, array('id'=>$country_id));
		App_Cache()->refreshTags(self::CACHE_TAG);
    }
	
	
	/**
	 * Deletes country with given ID
	 * @access public
	 * @param string $id    Country ID
	 * @throws App_Db_Exception_Table if country id is not specified
	 * @throws App_Exception_NonCritical if there are regions attached to that country and delete is impossible
	 */
	public function deleteCountry($id)
	{
		if(empty($id))
			throw new App_Db_Exception_Table('Country ID is not specified');

		$result = $this->db_select('loc_regions', array('id'), array('country_id'=>$id), array(), 1);
		if($this->db_fetch_row($result))
			throw new App_Exception_NonCritical('Երկիրը հնարավոր չէ հեռացնել, քանի որ վերջինս պարունակում է մարզեր:');

		$this->db_delete($this->_table, array('id'=>$id));
		App_Cache()->refreshTags(self::CACHE_TAG);
	}
}
