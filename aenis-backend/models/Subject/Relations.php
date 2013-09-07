<?php

class Subject_Relations extends HistoricalTable
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'subject_relations';

    /**
     * gets list of subject relations by given relationship
     * @param array $search
     * @internal param int $rel_id
     * @return mysqli result
     */
    public function getSubjectRelations($search = array())
    {
        $where = array(
            'subject_relations.new_id IS NULL'
        );

        if(!empty($search['subject_relation_id']))
            $where[] = "subject_relations.id =".$search["subject_relation_id"]."";

        if(!empty($search['transaction_id']))
            $where[] ="subject_relations.tr_id = ".$search['transaction_id']."";

        $where = implode(' AND ',array_unique($where));

        $q = "
              SELECT
        subject_relations.id AS subject_relation_id,
        subjects.id AS subject_id,
        n_contacts.id AS n_contact_id,
        j_contacts.id AS j_contact_id,
        relation_types.label,
        relation_types.id AS rel_type_id,
        IFNULL(getNContactName(subjects.n_contact_id),getJContactName(subjects.j_contact_id)) AS contactName

        FROM bs_subject_relations subject_relations
        LEFT JOIN bs_subject_relation_items subject_items ON subject_relations.id = subject_items.subject_rel_id
        LEFT JOIN bs_subject_relation_types relation_types ON relation_types.id = subject_relations.rel_type_id
        LEFT JOIN bs_subjects subjects ON subjects.id = subject_items.subject_id
        LEFT JOIN bs_n_contacts n_contacts ON subjects.n_contact_id = n_contacts.id
        LEFT JOIN bs_j_contacts j_contacts ON subjects.j_contact_id = j_contacts.id
        WHERE $where
        ";
        return $this->db_query($q);
    }
    /**
     * gets list of subjects by given integer value subject_relation_id
     * @param $subject_relation_id
     * @return mysqli_result
     */
    public function getSubjectsByRelationId($subject_relation_id)
    {
        $query = "
            SELECT
                 getNContactName(subjects.n_contact_id) AS n_contact_name,
                getJContactName(subjects.j_contact_id) AS j_contact_name
                FROM
                bs_subject_relation_items subject_relation_items
                LEFT JOIN bs_subjects subjects ON subject_relation_items.subject_id = subjects.id
                WHERE subjects.new_id IS NULL AND subject_relation_items.subject_rel_id = ".intval($subject_relation_id)."
        ";
        return $this->db_query($query);
    }



    /**
     * Add subject relation
     * @param array $data    An array with data for 'subject_relations' table
	 * @return integer    Id of newly inserted record
     */
    public function addSubjectRelation($data)
    {
		$insert_data = array(
            'rel_type_id' => $data['rel_type_id'],
            'tr_id' => $data['tr_id'],
        );
		return $this->insertUsingAdjacencyListModel($insert_data);
    }

    /**
     * add subject relation item associative array data for 'subject_relation_items'
     * @param $data
     */
    public function addSubjectRelationItem($data)
    {
        if(0 == $data['subject_id'])
        {
            $data['subject_id'] = $data['serviceSubject'][md5(serialize($data['serviceData']))];
        }

        $this->db_insert('subject_relation_items', array(
                'subject_rel_id' => $data['subject_relation_id'],
                'subject_id' => $data['subject_id']
            )
        );
    }
}
