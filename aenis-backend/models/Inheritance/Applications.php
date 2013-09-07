<?php
/**
 * inheritance application management
 * @package aenis
 */

/**
 * Methods for working with wills
 * @author BestSoft
 * @package aenis\workflow
 */

class Inheritance_Applications extends Transactions
{
    /**
     * Returns list of inheritance applications
     * @param array $search
     * @param int $start
     * @param int $limit
     * @param bool $returnCount
     * @return integer|mysqli_result
     */
    public function getInheritancesApplications($search = array(), $start = 0, $limit = 0, $returnCount = false)
    {
        $where = array(
            "tr.new_id IS NULL",
            "tr_types.ui_type = 'inheritance_application'"
        );
        $joins = array(
            'JOIN bs_transaction_types tr_types ON tr_types.id = tr.tr_type_id'
        );

        if (!empty($search['lu_date'])){
            $where[] = 'DATE_FORMAT("'.$search['lu_date'].'", "%Y-%m-%d") = DATE_FORMAT(tr.lu_date, "%Y-%m-%d")';
        }

        if(empty($search['transaction_id']))
        {
            $where[] = 'tr.del_user_id IS NULL';
        }
        else
        {
            $where[] = "tr.id = '".intval($search['id'])."'";
        }

        if(!empty($search['tr_type_id']))
            $where[] = 'tr.tr_type_id = '.$search['tr_type_id'].'';


        if(!empty($search['death_certificate']))
        {
            $contact_search_params = App_Array::pick($search,
                array(
                    'death_certificate' => 'death_certificate'
                )
            );

            $contact_ids = array();
            $oNaturalContact = new Contact_Natural();
            $contactResult = $oNaturalContact->getContacts($contact_search_params);
            while($contactRow = $this->db_fetch_array($contactResult))
            {
                $contact_ids[] = $contactRow['id'];
            }

            if(empty($contact_ids))
            {
                $where[] = '1=0'; //should be an empty result in this case
            }
            else
            {
                $where[] = "(
					SELECT
						subjects.id
					FROM bs_subjects subjects
					JOIN bs_parties parties ON parties.id = subjects.party_id AND parties.del_user_id IS NULL AND parties.new_id IS NULL
					JOIN bs_relationships rel ON rel.id = parties.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL
					WHERE subjects.del_user_id IS NULL
						  AND rel.tr_id = tr.id
						  AND subjects.n_contact_id IN (".implode(',', $contact_ids).")
					LIMIT 1
				) IS NOT NULL";
            }
        }

        /*if(!Acl()->allowed('inheritance.show_all_inheritances'))
        {
            $joins[] = 'JOIN bs_staff_user staff_user ON staff_user.user_id = tr.lu_user_id AND staff_user.is_active = 1';
            $joins[] = 'JOIN bs_staff staff ON staff_user.staff_id = staff.id';
            $joins[] = 'JOIN bs_departments dep ON staff.dep_id = dep.id AND dep.notarial_office_id = '.App_Registry::get('temp_sn')->notarial_office_id;
        }//??? discuss*/

        $where = implode(' AND ', array_unique($where));
        $joins = implode(PHP_EOL, array_unique($joins));

        if($returnCount)
        {
            $q = "SELECT
					COUNT(tr.id)
				FROM bs_transactions tr
				$joins
				WHERE $where
			";
            $result = $this->db_query($q);
            if($row = $this->db_fetch_row($result))
            {
                return intval($row[0]);
            }
            return 0;
        }
        else
        {
            $limit = intval($limit);
            $start = intval($start);
            $limit = ($limit > 0) ? "LIMIT $start, $limit" : '';

            $oLanguages = new Languages();
            $default_lang_id = $oLanguages->getDefaultLanguage()->id;
            $q = "SELECT
					tr.*,
					getTransactionPropertyValue(tr.id, 'transaction_code') AS transaction_code,
                                        getTransactionPropertyValue(tr.id, 'opening_notary') AS opening_notary_id,
					tr_types.service_fee_coefficient_min,
					tr_types.service_fee_coefficient_max,
					getUserFullName(tr.lu_user_id, $default_lang_id) AS lu_user,
					getUserFullName(getTransactionPropertyValue(tr.id, 'opening_notary'),".$default_lang_id.") AS opening_notary,
					getUserFullName(tr.notary_id, $default_lang_id) AS notary,
					transaction_statuses.code AS tr_status_code,
					transaction_statuses.title AS tr_status_title,
					tr_types_content.label AS tr_type_label,
					cases.case_code
				FROM (
					SELECT tr.id
					FROM bs_transactions tr
		            $joins
					WHERE $where
					ORDER BY tr.id DESC
					$limit
				) tmp
				JOIN bs_transactions tr ON tr.id = tmp.id AND tr.del_user_id IS NULL
				LEFT JOIN bs_transaction_types tr_types ON tr.tr_type_id = tr_types.id
				LEFT JOIN bs_transaction_types_content tr_types_content
			         ON tr_types_content.tr_type_id = tr_types.id AND tr_types_content.lang_id = $default_lang_id
				LEFT JOIN bs_transactions_status tr_status ON tr_status.tr_id = tr.id AND tr_status.new_id IS NULL AND tr_status.del_user_id IS NULL
				LEFT JOIN bs_transaction_statuses transaction_statuses ON transaction_statuses.id = tr_status.tr_status_id
                LEFT JOIN bs_cases cases ON tr.case_id = cases.id
                WHERE $where
           ";
           // echo $q;die;
            return $this->db_query($q);
        }
    }

    /**
     * Add new inheritance application
     * @access public
     * @param array $data    Array with data for transaction and related tables
     * @return integer    Id of newly inserted transaction
     */
    public function addInheritanceApplication($data)
    {
        $oCase = new Cases();
        $data['case_id'] = $oCase->addCase(
            array(
                'input_user_id' => App_Registry::get('temp_sn')->user_id,
                'notary_user_id' => $data['notary_id']
            )
        );
        $data['tr_id'] = $this->addTransaction($data);
        $this->addTransactionChildren($data);
        return $data['tr_id'];
    }



    /**
     * Edit an existing inheritance application
     * @access public
     * @param integer $transaction_id    Transaction ID
     * @param array $data   Associative array with fields as in 'transaction' database table
     * @throws App_Db_Exception_Table if transaction id is not specified
     * @return integer    Id of newly inserted transaction
     */
    public function updateInheritanceApplication($transaction_id, $data)
    {
        if(empty($transaction_id))
            throw new App_Db_Exception_Table('Transaction id is not specified');

        if($row = $this->getActualUsingAdjacencyListModel(array('id'=>$transaction_id)))
        {
            $data['case_id'] = $row['case_id'];
        }

        $data['tr_id'] = $this->updateTransaction($transaction_id, $data);

        $this->addTransactionChildren($data);
        return $data['tr_id'];
    }



    /**
     * Add transaction child tables data for inheritances
     * @param array $data
     * @return int
     */
    public function addTransactionChildren($data)
    {
        $oTransactionStatus = new Transactions_Status();
        $oTransactionStatus->setTransactionStatus($data['tr_id'], Transaction_Statuses::STATUS_SUBMITTED);
        $oProperties = new Transaction_Properties();
        $oProperties->addProperty($data['tr_id'], 'transaction_password', $this->generatePassword());

        $oProperties->addProperty($data['tr_id'], 'opening_notary', $data['opening_notary_id']);

        $oRelationship = new Transaction_Relationships();
        $relationship_id = $oRelationship->addRelationship($data);
        $oRelationship->handleRelationshipUploadedFiles(
            $relationship_id,
            $data['case_id'],
            $data['relationship_documents'],
            $this->getUploadedFiles('relationship_documents')
        );

        $oParty = new Transaction_Relationship_Parties();
        $data['rel_id'] = $relationship_id;

        foreach($data['parties'] as $party_data)
        {
            $party_data['rel_id'] = $relationship_id;
            $party_id = $oParty->addParty($party_data);

            $oSubjects = new Transaction_Relationship_Party_Subjects();
            foreach($party_data['data'] as $item)
            {
                $item['party_id'] = $party_id;
                $subject_id = $oSubjects->addSubject($item);

                $oSubjects->handleSubjectUploadedFiles(
                    $subject_id,
                    $data['case_id'],
                    $item['fileData']['existing_files'],
                    $this->getUploadedFiles($item['hash'])
                );
            }
        }

        $oNatural = new Contact_Natural();
        $oNatural->setPlaceOfResidence(array('death_certificate'=>$data['death_certificate'],'place_of_residence'=>$data['testatorAddress']));
    }

    /**
     * approves inheritance application with associative array 'data' and $_FILES files array
     * @param $data
     * @param $file
     */
    public function approveInheritanceApplication($data, $file)
    {
        $oRelationships = new Transaction_Relationships();
        $result = $oRelationships->getRelationships(array('transaction_id' => $data['transaction_id']));
        $relationship_id = 0;
        $doc_type_id = 0;
        if($row = $this->db_fetch_array($result)) //assume, that there can be only one relationship for inheritance application!!!
        {
            $relationship_id = $row['id'];
        }

        $row = $this->getActualUsingAdjacencyListModel(array('id'=>$data['transaction_id']));
        $case_id = $row['case_id'];

        $oLanguages = new Languages();
        $lang_id = $oLanguages->getDefaultLanguage()->id;

        $fileData = $file;
        unset($fileData['file_warrant']);

        $file = array(
            'file_warrant' => end($file)
        );


        $oDocTypes = new Document_Types();
        $result = $oDocTypes->getItems(array('tr_type_id'=>$data['tr_type_id']), array($lang_id));
        if($row = $oDocTypes->db_fetch_array($result))
        {
            $doc_type_id = $row['id'];
        }

        if(!empty($fileData['file_discount']['name']) && !empty($fileData['file_inheritor_types']['name'])
            && !empty($fileData['file_object_realty_parcel']['name']) && !empty($fileData['file_object_realty_building']['name'])
        )
        {
            $this->addPaymentDocuments($case_id,$relationship_id,3529,$fileData);
        }

        $oDocument = new Documents();
        $doc_dt_id = $oDocument->addDocument(
            array(
                'case_id' => $case_id,
                'rel_id' => $relationship_id,
                'doc_type_id' => $doc_type_id,
                'insert_type' => 4
            )
        )->dt_id;

        $oDocument_Files = new Document_Files();

        $result = $this->db_select('cases',array('case_code'), array('id'=>$case_id));
        if($row = $this->db_fetch_row($result))
        {
            $case_code = $row[0];
        }


        $oDocument_Files->insert($doc_dt_id, $file, $case_code, true);

        $oTransactionStatuses = new Transactions_Status();
        $oTransactionStatuses->setTransactionStatus($data['transaction_id'], Transaction_Statuses::STATUS_APPROVED);

        $oPayment = new Payments();
        $oPayment->addPayment(array(
            'transaction_id' => $data['transaction_id'],
            'type_id' => 1,
            'amount' => $data['duty']
        ));

        $oPayment->addPayment(array(
            'transaction_id' => $data['transaction_id'],
            'type_id' => 2,
            'amount' => $data['paymentNotary']
        ));
    }


    /**
     * adds payment priority documents
     * @param $case_id
     * @param $relationship_id
     * @param $doc_type_id
     * @param $file
     *
     */
    public function addPaymentDocuments($case_id,$relationship_id,$doc_type_id,$file)
    {
        $oDocument = new Documents();
        $doc_dt_id = $oDocument->addDocument(
            array(
                'case_id' => $case_id,
                'rel_id' => $relationship_id,
                'doc_type_id' => $doc_type_id,
                'insert_type' => 4
            )
        )->dt_id;

        $oDocument_Files = new Document_Files();

        $result = $this->db_select('cases',array('case_code'), array('id'=>$case_id));
        if($row = $this->db_fetch_row($result))
        {
            $case_code = $row[0];
        }
        $oDocument_Files->insert($doc_dt_id, $file, $case_code);
    }


    /**
     * gets opening notary for inheritance application
     * @param array $search
     */
    public function getOpeningNotary($search = array())
    {
        $q = "
         SELECT
                tr.id AS tr_id,
                transaction_properties.value AS notary_id,
                getUserFullName(transaction_properties.value,1) AS notary_full_name,
                n_contacts.place_of_residence AS residence_address
                FROM bs_n_contacts n_contacts
                LEFT JOIN bs_subjects subj ON subj.n_contact_id = n_contacts.id AND subj.new_id IS NULL
                LEFT JOIN bs_parties party ON party.id = subj.party_id AND party.new_id IS NULL
                LEFT JOIN bs_relationships rel ON rel.id = party.rel_id AND rel.new_id IS NULL
                LEFT JOIN bs_transactions tr ON tr.id = rel.tr_id AND tr.new_id IS NULL
                LEFT JOIN bs_transaction_properties transaction_properties ON transaction_properties.tr_id = tr.id
                WHERE n_contacts.new_id IS NULL AND transaction_properties.transaction_property_type_id = 31
            AND n_contacts.death_certificate = '".$this->db_escape_string($search['death_certificate'])."'
        ";
        return $this->db_query($q);
    }
}
