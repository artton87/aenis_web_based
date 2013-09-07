<?php

user_auth_check(true);
$data = array();

$oTransactions = new Transactions();
try
{
	$id = $_REQUEST['id'];

	// List of information, which can be requested
	// @example Passing 'info=objects,parties' will return only objects and parties

	$available_info = array(
		'properties',
        'statuses',
		'relationships',
		'relationship_documents',
		'relationship_document_files',
		'parties',
		'party_rights',
		'subjects',
		'subject_documents',
		'subject_document_files',
        'subject_relations',
		'objects',
		'object_documents',
		'object_document_files'
	);

	//collect data names which should be returned in $return_info array
	$return_info = array();
	$info = $_REQUEST['info'];

    ///////////////////////////
    if(isset($_POST['params']))
    {
        $params = App_Json::decode($_POST['params'], TRUE);
        $id = $params['id'];
        $info = $params['info'];
    }


    ///////////////////////////
	if(!empty($info))
	{
		$info = explode(',', $info);
		foreach($info as $name)
		{
			$name = trim($name);
			if(!in_array($name, $available_info)) continue;
			$return_info[$name] = 1;
		}
	}

	//collect the data
	$oTransactions = new Transactions();
	$result = $oTransactions->getTransactions(array('transaction_id'=>$id));
	if($row = $oTransactions->db_fetch_array($result))
	{
		//we should lock if transaction is not locked by someone else
		$continue = true;
		if(1 == $_REQUEST['lock'])
		{
			$logged_in_user_id = App_Registry::get('temp_sn')->user_id;
			if(empty($row['locked_user_id']) || $row['locked_user_id'] == $logged_in_user_id)
			{
				$oTransactions->lock($id);
				$oTransactions->unLockOthers($id);

				//commit the lock and continue
				$oTransactions->db_commit();

				$row['locked_user_id'] = $logged_in_user_id;
			}

			if($row['locked_user_id'] != $logged_in_user_id) //transaction is locked by somebody else
			{
				$continue = false;
			}
		}

		$data = App_Array::pick($row,
			'id',
			'app_id',
			'case_id',
            'parent_id',
			'notary_id', 'notary',
			'tr_type_id', 'tr_type_label',
			'locked_user_id', 'locked_user',
			'lu_user_id', 'lu_user', 'lu_date',
			'del_user_id', 'del_user', 'del_date'
		);

		if(!$continue) //do not continue if locked by another user
			throw new App_Exception_NonCritical('Խմբագրվում է '.$row['locked_user'].' օգտվողի կողմից?');

		//relationships
		if(isset($return_info['relationships']))
		{
			$data['relationships'] = array();
			$oRelationships = new Transaction_Relationships();
			$result_relationships = $oRelationships->getRelationships(array('transaction_id' => $id));
			while($row_relationships = $oRelationships->db_fetch_array($result_relationships))
			{
				$item_relationship = App_Array::pick($row_relationships, 'id', 'tr_id');
				$relationship_id = $item_relationship['id'];

				//parties
				if(isset($return_info['parties']))
				{
					$item_relationship['parties'] = array();
					$oParties = new Transaction_Relationship_Parties();
					$result_parties = $oParties->getParties(array('relationship_id' => $relationship_id));
					while($row_parties = $oParties->db_fetch_array($result_parties))
					{
						$item_party = App_Array::pick($row_parties,
							'id',
							'rel_id',
							'party_type_id',
							'party_type_code',
							'party_type_label'
						);
						$party_id = $item_party['id'];

						//party rights
                        if($item_party['party_type_code'] == 'agent')
                        {
                            if(isset($return_info['party_rights']))
                            {
                                $oPartyRights = new Transaction_Relationship_Party_Rights();
                                $result_partyRights = $oPartyRights->getPartyRights(array('party_id' => $party_id));
                                while($row_partyRights = $oPartyRights->db_fetch_array($result_partyRights))
                                {
                                    $item_partyRight = App_Array::pick($row_partyRights,
                                        'id',
                                        'party_id',
                                        'party_right_type_id',
                                        'party_right_type_label'
                                    );
                                    $item_party['rights'][] = $item_partyRight;
                                }
                            }
                        }


						//subjects
						if(isset($return_info['subjects']))
						{
							$item_party['subjects'] = array();
							$oSubjects = new Transaction_Relationship_Party_Subjects();
							$result_subjects = $oSubjects->getSubjects(array('party_id' => $party_id));
							while($row_subjects = $oSubjects->db_fetch_array($result_subjects))
							{
								$item_subject = App_Array::pick($row_subjects,
									'id',
									'party_id',
									'n_contact_id',
									'j_contact_id'
								);
								if(!empty($row_subjects['j_contact_id']))
								{
									$item_subject['contact_type'] = 'juridical';
									$item_subject['contact_name'] = $row_subjects['j_contact_name'];
									$item_subject['serviceData'] = array(
										'organization_name' => $row_subjects['j_organization_name'],
										'registration_number' => $row_subjects['j_registration_number'],
										'tax_account' => $row_subjects['j_tax_account'],
										'address' => $row_subjects['j_address'],
									);
								}
								else
								{
									$item_subject['contact_type'] = 'natural';
									$item_subject['contact_name'] = $row_subjects['n_contact_name'];
									$item_subject['serviceData'] = array(
										'first_name' => $row_subjects['n_first_name'],
										'last_name' => $row_subjects['n_last_name'],
										'second_name' => $row_subjects['n_second_name'],
										'social_card_number' => $row_subjects['n_social_card_number'],
										'passport_number' => $row_subjects['n_passport_number'],
										'date_of_birth' => App_Date::isoDatetime2Str($row_subjects['n_date_of_birth'], true),
										'email' => $row_subjects['n_email'],
										'fax' => $row_subjects['n_fax'],
										'address' => $row_subjects['n_address'],
										'place_of_residence' => $row_subjects['n_place_of_residence'],
										'death_certificate' => $row_subjects['n_death_certificate'],
										'given_date' => App_Date::isoDatetime2Str($row_subjects['n_given_date'], true),
									);
								}

								$subject_id = $item_subject['id'];

								//subject documents
								if(isset($return_info['subject_documents']))
								{
									$item_subject['documents'] = array();
									$oSubjectDocs = new Documents();
									$result_subjectDocs = $oSubjectDocs->getDocuments(array('subject_id'=>$subject_id));
									while($row_subjectDocs = $oSubjectDocs->db_fetch_array($result_subjectDocs))
									{
										$item_subjectDoc = App_Array::pick($row_subjectDocs, array(
											'id',
											'case_id',
											'rel_id',
											'subject_id',
											'object_id',
											'doc_type_id',
											'doc_type_label',
											'document_description',
											'document_date',
											'page_count',
											'doc_num_in_case',
                                            'tr_type_id'
										));
										$doc_dt_id = $row_subjectDocs['dt_id'];

										//subject document files
										if(isset($return_info['subject_document_files']))
										{
											$item_subjectDoc['files'] = array();
											$oDocFiles = new Document_Files();
											$result_docFiles = $oDocFiles->getFiles(array('doc_dt_id' => $doc_dt_id));
											while($row_docFiles = $oDocFiles->db_fetch_array($result_docFiles))
											{
												$item_docFile = App_Array::pick($row_docFiles, array(
													'id',
													'doc_id',
													'doc_dt_id',
													'file_name'
												));
												$item_subjectDoc['files'][] = $item_docFile;
											}
										}

										$item_subject['documents'][] = $item_subjectDoc;
									}
								}


								$item_party['subjects'][] = $item_subject;
							}
						}

						$item_relationship['parties'][] = $item_party;
					}
				}

				//relationship documents
				if(isset($return_info['relationship_documents']))
				{
					$item_relationship['documents'] = array();
					$oRelDocs = new Documents();
					$result_relDocs = $oRelDocs->getDocuments(array('rel_id'=>$relationship_id));
					while($row_relDocs = $oRelDocs->db_fetch_array($result_relDocs))
					{
						$item_relDoc = App_Array::pick($row_relDocs, array(
							'id',
							'case_id',
							'rel_id',
							'subject_id',
							'object_id',
							'doc_type_id',
							'doc_type_label',
							'document_description',
							'document_date',
							'page_count',
							'doc_num_in_case',
                            'tr_type_id'
						));
						$doc_dt_id = $row_relDocs['dt_id'];

						//relationship document files
						if(isset($return_info['relationship_document_files']))
						{
							$item_relDoc['files'] = array();
							$oDocFiles = new Document_Files();
							$result_docFiles = $oDocFiles->getFiles(array('doc_dt_id' => $doc_dt_id));
							while($row_docFiles = $oDocFiles->db_fetch_array($result_docFiles))
							{
								$item_docFile = App_Array::pick($row_docFiles, array(
									'id',
									'doc_id',
									'doc_dt_id',
									'file_name'
								));
								$item_relDoc['files'][] = $item_docFile;
							}
						}

						$item_relationship['documents'][] = $item_relDoc;
					}
				}

				//objects
				if(isset($return_info['objects']))
				{
					$item_relationship['objects'] = array();
					$oObjects = new Transaction_Relationship_Objects();
                    $object_data = array();
					$result_objects = $oObjects->getObjects(array('relationship_id' => $relationship_id));
					while($row_objects = $oObjects->db_fetch_array($result_objects))
					{
						$item_object = App_Array::pick($row_objects, array(
							'id',
							'rel_id',
							'object_type_code' => 'objectType'
						));
						$object_id = $item_object['id'];

						$oObjectProperties = new Transaction_Relationship_Object_Properties();
						switch($row_objects['object_type_code'])
						{
							case 'vehicle':
								$object_data = $oObjectProperties->getProperty($object_id, 'data');
								$object_data['vin'] = $oObjectProperties->getProperty($object_id, 'vin');
								$object_data['number'] = $oObjectProperties->getProperty($object_id, 'vehicle_number');

                                $item_object += array(
									"objectName" => $object_data['number'].' '.$object_data['body_type'].' '.$object_data['type'].' '.$object_data['model'].' '.$object_data['model_year'],
									"objectData" => $object_data
								);
								break;
							case 'other':
								$other_description = $oObjectProperties->getProperty($object_id, 'other_description');
								$item_object += array(
									"objectName" => $other_description,
									"objectData" => array(
										'name' => $other_description
									)
								);
								break;
							case 'realty':
								$object_data = $oObjectProperties->getProperty($object_id, 'data');
								$object_data['certificate_number'] = $oObjectProperties->getProperty($object_id, 'registration_number');
								$item_object += array(
									"objectName" => $object_data['certificate_number'].' '.$object_data['address'].' '.$object_data['building_total_area'].' '.$object_data['building_type'],
									"objectData" => $object_data
								);
								break;
							case 'share':
								//@TODO Add data for share
								$item_object += array(
									"objectName" => '',
									"objectData" => array()
								);
								break;
							case 'stock':
								//@TODO Add data for stock
								$item_object += array(
									"objectName" => '',
									"objectData" => array()
								);
								break;
						}

						//object documents
						if(isset($return_info['object_documents']))
						{
							$item_object['documents'] = array();
							$oObjectDocs = new Documents();
							$result_objectDocs = $oObjectDocs->getDocuments(array('object_id'=>$object_id));
							while($row_objectDocs = $oObjectDocs->db_fetch_array($result_objectDocs))
							{
								$item_objectDoc = App_Array::pick($row_objectDocs, array(
									'id',
									'case_id',
									'rel_id',
									'subject_id',
									'object_id',
									'doc_type_id',
									'doc_type_label',
									'document_description',
									'document_date',
									'page_count',
									'doc_num_in_case',
                                    'tr_type_id'
								));
								$doc_dt_id = $row_objectDocs['dt_id'];

								//object document files
								if(isset($return_info['object_document_files']))
								{
									$item_objectDoc['files'] = array();
									$oDocFiles = new Document_Files();
									$result_docFiles = $oDocFiles->getFiles(array('doc_dt_id' => $doc_dt_id));
									while($row_docFiles = $oDocFiles->db_fetch_array($result_docFiles))
									{
										$item_docFile = App_Array::pick($row_docFiles, array(
											'id',
											'doc_id',
											'doc_dt_id',
											'file_name'
										));
										$item_objectDoc['files'][] = $item_docFile;
									}
								}

								$item_object['documents'][] = $item_objectDoc;
							}
						}

						$item_relationship['objects'][] = $item_object;
					}
				}

				$data['relationships'][] = $item_relationship;
			}
		}

        if(isset($return_info['statuses']))
        {
            $data['statuses'] = array();
            $oTrStatus = new Transactions_Status();
            $trStatusResult = $oTrStatus->getTransactionStatus($row['id']);
            if($rowTrStatus = $oTrStatus->db_fetch_array($trStatusResult))
            {
                $data['statuses'] = $rowTrStatus['tr_status_id'];
            }

        }

		//transaction properties
		if(isset($return_info['properties']))
		{
			$data['properties'] = array();
			$oTrProps = new Transaction_Properties();
			$result_trProps = $oTrProps->getProperties($id);
			while($row_trProps = $oTrProps->db_fetch_array($result_trProps))
			{
				$item_trProp = App_Array::pick($row_trProps, array(
					'transaction_property_type_id' => 'id',
					'tr_id',
					'label',
					'type'
				));
				$ti = new Transaction_Property_Type_Info($row_trProps['id']);
				$item_trProp['value'] = $ti->decodeValue($row_trProps['value']);
				$data['properties'][] = $item_trProp;
			}
		}

        if(isset($return_info['subject_relations']))
        {
            $data['relations'] = array();
            $oSubjectRelation = new Subject_Relations();
            $result_subjectRelation = $oSubjectRelation->getSubjectRelations(array('transaction_id'=>$id));

            $item_subjectRelation = array();
            while($row_subjectRelation = $oSubjectRelation->db_fetch_array($result_subjectRelation))
            {
                $resultSubjRel = $oSubjectRelation->getSubjectRelations(array('subject_relation_id'=>$row_subjectRelation['subject_relation_id']));
                $subjectRelationData = array();
                while($rowSubjRel = $oSubjectRelation->db_fetch_array($resultSubjRel))
                {
                    if(!empty($row_subjects['j_contact_id']))
                    {
                        $serviceData = array(
                            'organization_name' => $rowSubjRel['j_organization_name'],
                            'registration_number' => $rowSubjRel['j_registration_number'],
                            'tax_account' => $rowSubjRel['j_tax_account'],
                            'address' => $rowSubjRel['j_address'],
                        );
                    }
                    else
                    {
                        $serviceData = array(
                            'first_name' => $rowSubjRel['n_first_name'],
                            'last_name' => $rowSubjRel['n_last_name'],
                            'second_name' => $rowSubjRel['n_second_name'],
                            'social_card_number' => $rowSubjRel['n_social_card_number'],
                            'passport_number' => $rowSubjRel['n_passport_number'],
                            'date_of_birth' => App_Date::isoDatetime2Str($rowSubjRel['n_date_of_birth'], true),
                            'email' => $rowSubjRel['n_email'],
                            'fax' => $rowSubjRel['n_fax'],
                            'address' => $rowSubjRel['n_address'],
                            'given_date' => App_Date::isoDatetime2Str($row_subjects['n_given_date'], true),
                        );
                    }



                    $subjectRelationData[] = array(
                        'contactName' => $rowSubjRel['contactName'],
                        'id' => $rowSubjRel['subject_id'],
                        'serviceData' => $serviceData
                    );
                }
                $item_subjectRelation['subject_relation_id'] = $row_subjectRelation['subject_relation_id'];
                $item_subjectRelation['rel_type_id'] = $row_subjectRelation['rel_type_id'];
                $item_subjectRelation['label'] = $row_subjectRelation['label'];
                $item_subjectRelation['data'] = $subjectRelationData;

                $data['relations'][] = $item_subjectRelation;
            }
        }
	}
}
catch(App_Exception_NonCritical $e)
{
	$oTransactions->db_rollback();
}
Ext::sendResponse(true, array(
	'data' => $data
));