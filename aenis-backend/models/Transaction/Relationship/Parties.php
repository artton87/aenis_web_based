<?php

/**
 * Relationship parties management
 * @package aenis
 */

/**
 * Contains methods for relationship parties management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Relationship_Parties extends HistoricalTable
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'parties';


	/**
	 * Returns parties
	 * @access public
	 * @param array $search    Optional. Array with the following search criteria:
	 * 						   party_id, party_type_id, party_type_code, relationship_id, transaction_id
     * @param array $lang_ids    In which languages to return results. If omitted, will return in all languages
	 * @return mysqli_result|resource
	 */
	public function getParties($search = array(), array $lang_ids = array())
	{
		$where = array();
		$joins = array(
			'LEFT JOIN bs_party_types party_types ON party_types.id = parties.party_type_id',
			'LEFT JOIN bs_party_types_content party_types_content ON party_types.id = party_types_content.party_type_id'
		);

		if(empty($search['party_id']))
		{
			$where[] = 'parties.del_user_id IS NULL';
			$where[] = 'parties.new_id IS NULL';
		}
		else
		{
			$where[] = "parties.id = '".intval($search['party_id'])."'";
		}

		if(!empty($search['party_type_id']))
			$where[] = "parties.party_type_id = '".intval($search['party_type_id'])."'";

		if(!empty($search['party_type_code']))
		{
			$where[] = "party_types.party_type_code = '".$this->db_escape_string($search['party_type_code'])."'";
			$joins[] = "LEFT JOIN bs_party_types party_types ON party_types.id = parties.party_type_id";
            $joins[] = "LEFT JOIN bs_party_types_content party_types_content ON party_types.id = party_types_content.party_type_id";
        }

		if(!empty($search['relationship_id']))
		{
			$where[] = "rel.id = '".intval($search['relationship_id'])."'";
			$joins[] = 'JOIN bs_relationships rel ON rel.id = parties.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL';
		}

		if(!empty($search['transaction_id']))
		{
			$where[] = "tr.id = '".intval($search['transaction_id'])."'";
			$joins[] = 'JOIN bs_relationships rel ON rel.id = parties.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL';
			$joins[] = 'JOIN bs_transactions tr ON tr.id = rel.tr_id AND tr.del_user_id IS NULL AND tr.new_id IS NULL';
		}

		$where = implode(' AND ', $where);
		$joins = implode(PHP_EOL, array_unique($joins));

        foreach($lang_ids as &$_lang_id)
            $_lang_id = intval($_lang_id);
        $lang_id_condition = empty($lang_ids) ? '' : 'AND party_types_content.lang_id IN ('.implode(',',$lang_ids).')';

		$q = "SELECT
				parties.*,
                party_types.party_type_code,
            	party_types_content.label AS party_type_label
            FROM bs_parties parties
            $joins $lang_id_condition
            WHERE $where
        ";
		return $this->db_query($q);
	}


	/**
	 * Add new party
	 * @param array $data     Associative array with 'parties' database table field values
	 * @return integer    Id of newly inserted party
	 */
	public function addParty($data)
	{
		$insert_data = App_Array::pick($data, 'rel_id', 'party_num');
        if(empty($data['party_type_id']))
        {
			$insert_data['party_type_id'] = array('value'=>'getPartyTypeIdByCode("'.$data['party_type_code'].'")', 'escape' => false);
        }
        else
        {
			$insert_data['party_type_id'] = $data['party_type_id'];
        }
		return $this->insertUsingAdjacencyListModel($insert_data);
	}
}
