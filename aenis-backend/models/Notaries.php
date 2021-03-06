<?php

/**
 * @author Best Soft
 * @package BS
 */

/**
 * Նոտարների տվյալների հետ աշխատանքի ֆունկցիաներ
 * @package BS
 */
class Notaries extends App_Db_Table_Abstract {
	
	/**
     * Number of rows per page
     */
    const ITEMS_PER_PAGE = 20;
	
	/**
     * Վերադարձնում է Նոտարական գրասենյակների տվյալները
     * @access public
     * @param string $search     որոնման պարամետրեր
     * @param boolean $return_count    Վերադարձնում է տողերի քանակը եթե TRUE 
     * @return mysqli_result
     */
	public function getOffices($search, $return_count = FALSE) 
	{
		$dba = $this->getAdapter();
		
		$where = array();
		
		if (!empty($search['id'])) 
		{
            $where[] = 'offices.id = ' . $dba->escape_string($search['id']);
        }
		
		$where = (count($where) > 0) ? 'WHERE ' . implode(' AND ', $where) : '';
		
		if($return_count){
			$select = 'count(*) AS c';
		}else{
			$select = 
				'
					offices.id office_id,
					offices.latitude,
					offices.longitude,
					communities.region_id,							
					offices.postal_index
				';  
		}
		
		$qLimit = '';
		if(isset($search['start'])){
			$qLimit = "LIMIT " . $dba->escape_string($search['start']) * self::ITEMS_PER_PAGE . ', ' . self::ITEMS_PER_PAGE;
		}
            
		$query = 
		"
			SELECT $select
			FROM bs_notarial_offices offices
			LEFT JOIN bs_loc_communities communities ON offices.community_id = communities.id	
			$where
            ORDER BY communities.region_id,offices.id DESC
			$qLimit
		";

		$result = $dba->query($query);
        if ($return_count) {
            if ($row = $dba->fetch_array($result)) {
                $count = $row['c'];
            }
            else
                $count = 0;
            return $count;
        }
        return $result;	
		
	}
	 
	
	/**
     * Վերադարձնում է Նոտարների տվյալները
     * @access public
     * @param string $search     որոնման պարամետրեր
     * @param string $lang_id    Լեզվի նույնացման համարը
     * @param boolean $return_count    Վերադարձնում է տողերի քանակը եթե TRUE 
     * @return mysqli_result
     */
    public function getNotaries($search, $lang_id, $return_count = FALSE) {
        $dba = $this->getAdapter();
        $where = array('users.is_notary=1');

        if (!empty($lang_id)) {            
            $lang_filter_1 = 'AND users_content.lang_id = ' . intval($lang_id);
            $lang_filter_2 = 'AND communities_content.lang_id = ' . intval($lang_id);
            $lang_filter_3 = 'AND loc_regions_content.lang_id = ' . intval($lang_id);
        }

        if (!empty($search['notary_id'])) 
		{
            $where[] = 'users.id = '.intval($search['notary_id']);
        }

        if (!empty($search['regions_id']))
		{
			$where[] = 'regions_content.region_id = '.intval($search['regions_id']);
		}
		
		if (!empty($search['office_id']))
		{
			$where[] = 'offices.id = '.intval($search['office_id']);
		}
            
        if(!empty($search['term'])){
            $keywords = explode(' ', $search['term']) ;
            
            foreach ($keywords as $keyword) {
                if (trim($keyword == ""))
                    continue;
                
                $where[] = '
                         CONCAT(
                                users_content.first_name,
                                users_content.last_name
                                ) LIKE \'%' . trim($keyword) . '%\'';
            }
            
        }

        $where = (count($where) > 0) ? 'WHERE ' . implode(' AND ', $where) : '';
		
		if($return_count){
			$select = 'count(*) AS c';
		}else{
			$select = '
					users.id notary_id,
					users.phone,
					users.email,
					users.fax_number,
					getNotarialOfficeAddressByUser(users.id) AS notary_address,
					offices.id office_id,					
					users_content.first_name name,
					users_content.last_name AS lastname,
					communities_content.name community,
                    loc_regions_content.region_id regions_id,                            
					loc_regions_content.name as regions_name';
					
		}
		$qLimit = '';
		if(isset($search['start'])){
			$qLimit = "LIMIT " . $dba->escape_string($search['start']) * self::ITEMS_PER_PAGE . ', ' . self::ITEMS_PER_PAGE;
		}
		//AND users.is_notary = 1
        $q = "
			SELECT $select
			FROM bs_users as users
			JOIN bs_users_content users_content ON users_content.user_id = users.id " . $lang_filter_1 . "
			JOiN bs_staff_user staff_user ON users.id = staff_user.user_id AND staff_user.is_active=1
			JOiN bs_staff staff ON staff_user.staff_id = staff.id
			JOiN bs_departments departments ON staff.dep_id = departments.id
			JOIN bs_notarial_offices offices ON offices.id = departments.notarial_office_id
			LEFT JOIN bs_loc_communities communities ON offices.community_id = communities.id
            LEFT JOIN bs_loc_communities_content communities_content ON communities_content.community_id = communities.id " . $lang_filter_2 . "
            LEFT JOIN bs_loc_regions ON bs_loc_regions.id = communities.region_id
            LEFT JOIN bs_loc_regions_content loc_regions_content ON loc_regions_content.region_id = bs_loc_regions.id " . $lang_filter_3 . "
			LEFT JOIN bs_languages ON bs_languages.id = users_content.lang_id
			$where 
            ORDER BY loc_regions_content.region_id, users_content.first_name, users_content.last_name
			$qLimit
			";
		$result = $dba->query($q);
        if ($return_count) {
            if ($row = $dba->fetch_array($result)) {
                $count = $row['c'];
            }
            else
                $count = 0;
            return $count;
        }
		
        return $result;
    }
}
