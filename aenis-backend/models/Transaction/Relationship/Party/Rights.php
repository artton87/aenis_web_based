<?php
/**
 * Transaction party rights management
 * @package aenis
 */

/**
 * Contains methods for transaction party rights management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Relationship_Party_Rights extends HistoricalTable
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'party_rights';


    /**
     * Add party right
	 * @access public
     * @param $data    Array with data for tables 'party_rights' and 'party_rights_dt'
	 * @return integer    Id of newly added record
     */
    public function addPartyRight($data)
    {
		$insert_data = App_Array::pick($data, 'party_id', 'party_right_type_id');
        return $this->insertUsingAdjacencyListModel($insert_data);
    }


	/**
	 * Returns party rights
	 * @access public
	 * @param array $search    Optional. Array with the following search criteria:
	 * 						   party_right_id, party_id
	 * @return mysqli_result|resource
	 */
	public function getPartyRights($search = array())
	{
		$where = array();
		$joins = array(
			'LEFT JOIN bs_party_right_types party_right_types ON party_right_types.id = party_rights.party_right_type_id'
		);

		if(empty($search['party_right_id']))
		{
			$where[] = 'party_rights.del_user_id IS NULL';
			$where[] = 'party_rights.new_id IS NULL';
		}
		else
		{
			$where[] = "party_rights.id = '".intval($search['party_right_id'])."'";
		}

		if(!empty($search['party_id']))
			$where[] = "party_rights.party_id = '".intval($search['party_id'])."'";

		$where = implode(' AND ', $where);
		$joins = implode(PHP_EOL, array_unique($joins));

		$q = "SELECT
				party_rights.*,
                party_right_types.label AS party_right_type_label
            FROM bs_party_rights party_rights
            $joins
            WHERE $where
        ";
		return $this->db_query($q);
	}
}
