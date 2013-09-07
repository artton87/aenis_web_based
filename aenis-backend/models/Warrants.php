<?php
/**
 * Warrants management
 * @package aenis\Workflow
 */

/**
 * Methods for warrants management
 * @author BestSoft
 * @package aenis\Workflow
 */
class Warrants extends Transactions
{
    /**
     * Returns list of warrants
     * @access public
     * @param array $search    Array with search criteria
     * @param integer $start    Starting from which record to return results
     * @param integer $limit    How many results to return. Set to 0 to get all records.
     * @param boolean $returnCount    Optional. If given, returns number of matching records
     * @return mysqli_result|integer    Result with matching records or record count (if $return_count=true)
     */
    public function getWarrants($search = array(), $start = 0, $limit = 0, $returnCount = false)
    {
        $where = array(
            "tr_types.ui_type = 'warrant'"
        );
        $joins = array(
            'JOIN bs_transaction_types tr_types ON tr_types.id = tr.tr_type_id'
        );

        if (!empty($search['lu_date'])){
            $where[] = 'DATE_FORMAT("'.$search['lu_date'].'", "%Y-%m-%d") = DATE_FORMAT(tr.lu_date, "%Y-%m-%d")';
        }

		if (!empty($search['tr_type_id'])){
			$where[] = 'tr.tr_type_id = '.$search['tr_type_id'];
		}

        if(empty($search['transaction_id']))
        {
            $where[] = 'tr.del_user_id IS NULL and tr.new_id IS NULL';
        }
        else
        {
            $where[] = "tr.id = '".intval($search['transaction_id'])."'";
        }

		$n_contact_ids = $j_contact_ids = $contact_ids = array();
        if(isset($search['parties']))
        {
            $party_types = array();
            foreach($search['parties'] as $party)
            {
                $party_types[] = $party['party_type_id'];
                $party_type_id = $party['party_type_id'];

                foreach($party['data'] as $item)
                {
                    if($item['contactType'] == 'natural')
                        $n_contact_ids[$party_type_id][] = $item['n_contact_id'];
                    if($item['contactType'] == 'juridical')
                        $j_contact_ids[$party_type_id][] = $item['j_contact_id'];
                }
            }

        }
        if (isset($search['properties'])){
            $properties_where = array();
            /*foreach ($search['properties'] as $key => $value ){
                if (preg_match('#(\d+)$#', $key, $matches)) {
                    $property_id = $matches[1];
                    if (strpos($key, 'from') !== false)
                        $symbol = '>';
                    else if (strpos($key, 'to') !== false)
                        $symbol = '<';
                    else //if (strpos($key, 'field') !== false)
                    $symbol = '=';
                    $properties_where[] = "bs_transaction_property_types.id = " . $property_id."
											AND bs_transaction_properties.value ".$symbol."'".$value."'";
                }
            }*/
			if ($search['properties']['transaction_code']){
				$where[] = "tr_prop_types.code = 'transaction_code'
											AND tr_prop.value = '".$search['properties']['transaction_code']."'";
				$joins[] = "LEFT JOIN bs_transaction_properties tr_prop ON tr_prop.tr_id = tr.id";
				$joins[] = "LEFT JOIN bs_transaction_property_types tr_prop_types
							ON tr_prop.transaction_property_type_id = tr_prop_types.id";
			}
            //Logger::out($properties_where);
        }

        $object_ids = array();
        if(isset($search['objects']))
        {
            foreach($search['objects'] as $item)
            {
                if(!empty($item['objectData']))
                    $object_ids[] = $item['objectData']['id'];
            }
        }
        $object_id_conditions = array();
        $object_id_condition =  empty($object_ids) ? '' : '(objects.id IN ('.implode(',', $object_ids).'))';
        if(!empty($object_id_condition))
            $object_id_conditions[] = $object_id_condition;

        if(!empty($object_id_conditions))
        {
            $object_id_conditions = implode(' OR ', $object_id_conditions);
            $where[] = "(
					SELECT
						objects.id
					FROM bs_objects objects
					JOIN bs_object_properties object_properties ON objects.id = object_properties.object_id AND objects.del_user_id IS NULL AND objects.new_id IS NULL
					JOIN bs_relationships rel ON rel.id = objects.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL
					WHERE objects.del_user_id IS NULL
						  AND rel.tr_id = tr.id
						  AND ($object_id_conditions)
					LIMIT 1
				) IS NOT NULL";
        }


        $contact_id_conditions = array();
        if(!empty($n_contact_ids)){
            foreach ($n_contact_ids as $party_type_id => $contact_ids){
                $contact_id_condition = '(subjects.n_contact_id IN ('.implode(',', $contact_ids).') AND parties.party_type_id = '.$party_type_id.')';
                $contact_id_conditions[] = $contact_id_condition;
            }
        }
        if(!empty($j_contact_ids)){
            foreach ($j_contact_ids as $party_type_id => $contact_ids){
                $contact_id_condition = '(subjects.j_contact_id IN ('.implode(',', $contact_ids).') AND parties.party_type_id = '.$party_type_id.')';
                $contact_id_conditions[] = $contact_id_condition;
            }
        }

        if(!empty($contact_id_conditions))
        {
            $contact_id_conditions = implode(' OR ', $contact_id_conditions);
            //$party_type_id_conditions = implode(', ',$party_type_id_conditions);
            $where[] = "(
					SELECT
						subjects.id
					FROM bs_subjects subjects
					JOIN bs_parties parties ON parties.id = subjects.party_id AND parties.del_user_id IS NULL AND parties.new_id IS NULL
					JOIN bs_relationships rel ON rel.id = parties.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL
					WHERE subjects.del_user_id IS NULL
						  AND rel.tr_id = tr.id
						  AND ($contact_id_conditions)
						  "./*AND ($party_type_id_conditions).*/"
					LIMIT 1
				) IS NOT NULL";
        }


        if(!Acl()->allowed('warrant.show_all_warrants'))
        {
            $oStaff = new Staff();
            $staff_user_sub_select = $oStaff->getStaffsDescendantUsersQuery(App_Registry::get('temp_sn')->user_staffs);

            $notary_transactions_see_condition = '';
            if(Acl()->allowed('warrant.show_notary_warrants'))
            {
                $user_id = App_Registry::get('temp_sn')->user_id;
                $result = $this->db_query("SELECT getUserNotaries($user_id, NULL) FROM DUAL");
                if(($row = $this->db_fetch_row($result)) && !empty($row[0]))
                {
                    $notary_transactions_see_condition = 'OR (tr.notary_id IN ('.$row[0].'))';
                }
            }

            //show transactions of child staff users, his own, and, optionally of his notary
            $where[] = "(
				(tr.lu_user_id IN $staff_user_sub_select)
				 OR
				(tr.notary_id IN $staff_user_sub_select)
				 OR
				(tr.del_user_id IN $staff_user_sub_select)
				$notary_transactions_see_condition
			)";
        }

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
					tr_types.service_fee_coefficient_min,
					tr_types.service_fee_coefficient_max,
					getUserFullName(tr.notary_id, $default_lang_id) AS notary,
					getUserFullName(tr.lu_user_id, $default_lang_id) AS lu_user,
					customers.name,
					customers.middle_name,
					customers.last_name,
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
				JOIN bs_transactions tr ON tr.id = tmp.id
				LEFT JOIN bs_transaction_types tr_types ON tr.tr_type_id = tr_types.id
				LEFT JOIN bs_transaction_types_content tr_types_content
					   ON tr_types_content.tr_type_id = tr_types.id AND tr_types_content.lang_id = $default_lang_id
				LEFT JOIN bs_applications apps ON apps.id = tr.app_id
				LEFT JOIN bs_customers customers ON customers.id = apps.customer_id
				LEFT JOIN bs_transactions_status tr_status ON tr_status.tr_id = tr.id AND tr_status.del_user_id IS NULL AND tr_status.new_id IS NULL
				LEFT JOIN bs_transaction_statuses transaction_statuses ON transaction_statuses.id = tr_status.tr_status_id
                LEFT JOIN bs_cases cases ON tr.case_id = cases.id
                WHERE transaction_statuses.mode<>1
           ";
            return $this->db_query($q);
        }
    }


    /**
     * Add new warrant
     * @access public
     * @param array $data     Associative array with 'transactions' database table field values
     * @return integer    ID of newly added record from 'transactions' table
     */
    public function addWarrant($data)
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
     * Updates a warrant
     * @access public
     * @param integer $id    Contract id
     * @param array $data     Associative array with 'transactions' database table field values
     * @throws App_Db_Exception_Table if contract id is not specified
     * @return integer    ID of newly inserted record
     */
    public function updateWarrant($id, $data)
    {
        if(empty($id))
            throw new App_Db_Exception_Table('Warrant ID is not specified');

        if($row = $this->getActualUsingAdjacencyListModel(array('id'=>$id)))
        {
            $data['case_id'] = $row['case_id'];
        }
        $data['tr_id'] = $this->updateTransaction($id, $data);
        $this->addTransactionChildren($data);
        return $data['tr_id'];
    }


    /**
     * Add transaction child tables data
     * @access public
     * @param array $data
     */
    public function addTransactionChildren($data)
    {
        $oTransactionStatus = new Transactions_Status();
        $oTransactionStatus->setTransactionStatus($data['tr_id'], Transaction_Statuses::STATUS_SUBMITTED);

        $oProperties = new Transaction_Properties();
        foreach($data['properties'] as $value)
        {
            $oProperties->addProperty($data['tr_id'], $value['id'], $value['value']);
        }
        $oProperties->addProperty($data['tr_id'], 'transaction_password', $this->generatePassword());

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

            $result = $oParty->getParties(array('party_id'=>$party_id));
            if($row = $this->db_fetch_array($result))
            {
                $party_type_code = $row['party_type_code'];
            }

            $oSubjects = new Transaction_Relationship_Party_Subjects();
            foreach($party_data['data'] as $item)
            {
                $item['party_id'] = $party_id;
                $subject_id = $oSubjects->addSubject($item);

                if($party_type_code === 'agent')
                    $subjects[md5(serialize($item['serviceData']))] = $subject_id;


                $oSubjects->handleSubjectUploadedFiles(
                    $subject_id,
                    $data['case_id'],
                    $item['fileData']['existing_files'],
                    $this->getUploadedFiles($item['hash'])
                );
            }

            if($party_type_code == 'agent')
            {
                // party rights part
                $oPartyRight = new Transaction_Relationship_Party_Rights();
                foreach($data['party_rights'] as $item)
                {
                    $item['party_id'] = $party_id;
                    $oPartyRight->addPartyRight($item);
                }

                $oSubjectsRelations = new Subject_Relations();
                foreach($data['subject_relations'] as $relation)
                {
                    $subject_relations['rel_type_id'] = $relation['rel_type_id'];
                    $subject_relations['tr_id'] = $data['tr_id'];
                    $subject_relation_id = $oSubjectsRelations->addSubjectRelation($subject_relations);

                    foreach($relation['data'] as $item)
                    {
                        $item['subject_relation_id'] = $subject_relation_id;
                        $item['serviceSubject'] = $subjects;
                        $oSubjectsRelations->addSubjectRelationItem($item);
                    }
                }
            }
        }

        // objects part
        $oObject = new Transaction_Relationship_Objects();
        foreach($data['objects'] as $item)
        {
            $data['rel_id'] = $relationship_id;
            $data['object_type'] = $item['objectType'];
            $object_id = $oObject->addObject($data, $item['objectData']);

            $oObject->handleObjectUploadedFiles(
                $object_id,
                $data['case_id'],
                $item['fileData']['existing_files'],
                $this->getUploadedFiles($item['hash'])
            );
        }
    }

    /**
     * get contract property value
     * @param $transaction_id
     * @param $property_code
     * @return bool
     */
    public function getContractPropertyValue($transaction_id,$property_code)
    {
        $result = $this->db_select('transactions',array('id'),array('id'=>$transaction_id, 'new_id IS NULL','del_user_id IS NULL'));
        if($row = $this->db_fetch_row($result))
        {
            $propertiesResult = $this->db_select('transaction_properties',array("getTransactionPropertyValue(".$row[0].",'".$property_code."')"), array());
            if($propertiesRow = $this->db_fetch_row($propertiesResult))
            {
                return $propertiesRow[0];
            }
            else
            {
                return null;
            }
        }
        return null;
    }


    /**
     * approves warrant with associative array 'data' and $_FILES files array
     * @param $data
     * @param $file
     */
    public function approveWarrant($data, $file)
    {
        $oRelationships = new Transaction_Relationships();
        $result = $oRelationships->getRelationships(array('transaction_id' => $data['transaction_id']));
        $relationship_id = 0;
        $doc_type_id = 0;
        if($row = $this->db_fetch_array($result)) //assume, that there can be only one relationship for contract
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

        if(!empty($fileData['file_discount']['name']))
        {
            $fileData = array(
                'file_discount' =>  array_shift($fileData)
            );
            $this->addPaymentDocuments($case_id,$relationship_id,3529,$fileData);
        }
        else
        {
            if( (!empty($fileData['file_inheritor_types']['name'])
                && !empty($fileData['file_object_realty_parcel']['name']) && !empty($fileData['file_object_realty_building']['name']))
            )
            {
                unset($fileData['file_discount']);
                $this->addPaymentDocuments($case_id,$relationship_id,3529,$fileData);
            }
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
}
