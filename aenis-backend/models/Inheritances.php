<?php
/**
 * Wills management
 * @package aenis
 */

/**
 * Methods for working with wills
 * @author BestSoft
 * @package aenis\workflow
 */

class Inheritances extends Transactions
{
	/**
	 * Returns list of wills
	 * @param array $search
	 * @param int $start
	 * @param int $limit
	 * @param bool $returnCount
	 * @return integer|mysqli_result
	 */
	public function getInheritances($search = array(), $start = 0, $limit = 0, $returnCount = false)
	{
            
		$where = array(
			"tr.new_id IS NULL",
			"tr_types.ui_type = 'inheritance_final_part'"
		);
		$joins = array(
			'JOIN bs_transaction_types tr_types ON tr_types.id = tr.tr_type_id'
		);


        if (!empty($search['lu_date'])){
            $where[] = 'DATE_FORMAT("'.$search['lu_date'].'", "%Y-%m-%d") = DATE_FORMAT(tr.lu_date, "%Y-%m-%d")';
        }

		$n_contact_ids = $j_contact_ids = $contact_ids = array();
		//Inheritance search form
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
					//$contact_ids[$party_type_id][] = $item['n_contact_id'];

				}
			}
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

		if (isset($search['properties'])){
			$properties_where = array();
			foreach ($search['properties'] as $key => $value ){
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
			}
			if ($search['properties']['transaction_code']){
				$where[] = "tr_prop_types.code = 'transaction_code'
											AND tr_prop.value = '".$search['properties']['transaction_code']."'";
				$joins[] = "LEFT JOIN bs_transaction_properties tr_prop ON tr_prop.tr_id = tr.id";
				$joins[] = "LEFT JOIN bs_transaction_property_types tr_prop_types
							ON tr_prop.transaction_property_type_id = tr_prop_types.id";
			}
		}
		//inheritance search form end

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


		if((!empty($search['subject_first_name']) && !empty($search['subject_second_name'])
				&& !empty($search['subject_last_name']))
			|| !empty($search['subject_passport_number']) || !empty($search['subject_social_card_number']) || !empty($search['death_certificate']))
		{
			$contact_search_params = App_Array::pick($search,
				array(
					'subject_first_name' => 'first_name',
					'subject_second_name' => 'second_name',
					'subject_last_name' => 'last_name',
					'subject_passport_number' => 'passport_number',
					'subject_social_card_number' => 'social_card_number',
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

		if(!Acl()->allowed('inheritance.show_all_inheritances'))
		{
			$joins[] = 'JOIN bs_staff_user staff_user ON staff_user.user_id = tr.lu_user_id AND staff_user.is_active = 1';
			$joins[] = 'JOIN bs_staff staff ON staff_user.staff_id = staff.id';
			$joins[] = 'JOIN bs_departments dep ON staff.dep_id = dep.id AND dep.notarial_office_id = '.App_Registry::get('temp_sn')->notarial_office_id;
		}//??? discuss

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
					getUserFullName(tr.lu_user_id, $default_lang_id) AS input_user,
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
                WHERE transaction_statuses.mode<>1
           ";

			return $this->db_query($q);
		}
	}

	/**
	 * Add new inheritance transaction
	 * @access public
	 * @param array $data    Array with data for transaction and related tables
	 * @return integer    Id of newly inserted transaction
	 */
	public function addInheritance($data)
	{
		$oCase = new Cases();
		$data['case_id'] = $oCase->addCase(
			array(
				'input_user_id' => App_Registry::get('temp_sn')->user_id,
				'notary_user_id' => $data['notary_id']
			)
		);

		//$data['tr_type_id'] = Transaction_Types::TRANSACTION_TYPE_INHERITANCE;
		//if(Transaction_Types::TRANSACTION_TYPE_INHERITANCE_BY_WILL == $data['tr_type_id'])
		//$data['tr_type_id'] = TRANSACTION_TYPE_WILL;
		$data['tr_id'] = $this->addTransaction($data);
		$this->addTransactionChildren($data);
		return $data['tr_id'];

	}



	/**
	 * Edit an existing inheritance transaction
	 * @access public
	 * @param integer $transaction_id    Transaction ID
	 * @param array $data   Associative array with fields as in 'transaction' database table
	 * @throws App_Db_Exception_Table if transaction id is not specified
	 * @return integer    Id of newly inserted transaction
	 */
	public function updateInheritance($transaction_id, $data)
	{
		if(empty($transaction_id))
			throw new App_Db_Exception_Table('Transaction id is not specified');

		if($row = $this->getActualUsingAdjacencyListModel(array('id'=>$transaction_id)))
		{
			$data['case_id'] = $row['case_id'];
		}

		//$data['tr_type_id'] = Transaction_Types::TRANSACTION_TYPE_INHERITANCE;
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
		//$oProperties->addProperty($data['tr_id'], 'inheritance_by_law', $data['inheritance_type']);
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
		$oProperties->addProperty($data['tr_id'], 'template_content', $data['content']);
		/*$party_codes = array('testator', 'inheritor');

		$oSubjects = new Transaction_Relationship_Party_Subjects();


		foreach($party_codes as $party_code)
		{
			$data['party_type_code'] = $party_code;
			$party_id = $oParty->addParty($data);

			foreach($data[$party_code] as $item)
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
		}*/


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
	 * approve inheritance
	 * @param $data
	 * @param $file
	 * @internal param $transaction_id
	 */
	public function approveInheritance($data, $file)
	{
		$oRelationships = new Transaction_Relationships();
		$result = $oRelationships->getRelationships(array('transaction_id' => $data['transaction_id']));
		if($row = $this->db_fetch_array($result)) //assume, that there can be only one relationship for warrant
		{
			$relationship_id = $row['id'];
		}

		$row = $this->getActualUsingAdjacencyListModel(array('id'=>$data['transaction_id']));
		$case_id = $row['case_id'];

		$oLanguages = new Languages();
		$lang_id = $oLanguages->getDefaultLanguage()->id;

		/*$oDocTypes = new Document_Types();
		$result = $oDocTypes->getItems(array('doc_type_code'=>'testament_original'), array($lang_id));
		if($row = $oDocTypes->db_fetch_array($result))
		{
			$doc_type_id = $row['id'];
		}*/

		$oDocTypes = new Document_Types();
		$result = $oDocTypes->getItems(array('tr_type_id'=>$data['tr_type_id']), array($lang_id));
		if($row = $oDocTypes->db_fetch_array($result))
		{
			$doc_type_id = $row['id'];
		}

		$oDocument = new Documents();
		$doc_dt_id = $oDocument->addDocument(
			array(
				'case_id' => $case_id,
				'rel_id' => $relationship_id,
				'doc_type_id' => $doc_type_id,
				'insert_type' =>4
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

		$this->db_insert('payments',array(
				'transaction_id' => $data['transaction_id'],
				'type_id' => 1,
				'amount' => $data['duty'],
				'creation_date' => self::$DB_TIMESTAMP
			)
		);

		$this->db_insert('payments',array(
				'transaction_id' => $data['transaction_id'],
				'type_id' => 2,
				'amount' => $data['paymentNotary'],
				'creation_date' => self::$DB_TIMESTAMP
			)
		);
	}
}
