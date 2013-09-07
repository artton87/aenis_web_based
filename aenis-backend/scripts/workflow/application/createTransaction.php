<?php
user_auth_check(true);
try
{
    define('ROOT_ID_SELECT', 76);
    if(Acl()->denied('transaction.add'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարք ավելացնելու համար:');

    $oTransactions = new Transactions();
    $oTransactionStatuses = new Transactions_Status();
    $oRelationships = new Transaction_Relationships();
    $oObjectProperties = new Transaction_Relationship_Object_Properties();
    $oSubjects = new Transaction_Relationship_Party_Subjects();
    $oDocType = new Document_Types();
    $params = App_Json::decode($_POST['params'], TRUE);

    $post_data = $params['post_data'];

    if(isset($params['lang_id']) && isset($params['get_Types']))
    {
        $lang_id = $params['lang_id'];
        $dba = App_Db_Table_Abstract::getAdapter();
        $query = "
		SELECT a_t.id, atc.label as name, a_t.parent_id, a_t.form_template
		FROM bs_transaction_types AS a_t
			LEFT JOIN bs_transaction_types_content AS atc
				ON atc.tr_type_id = a_t.id
					AND atc.lang_id = $lang_id
   		WHERE a_t.parent_id is not null AND a_t.parent_id != ".constant('ROOT_ID_SELECT')." AND a_t.is_used_in_portal = 1
   		ORDER BY a_t.order_in_list ASC, name ASC
		";

        $res = array();
        $result = $dba->query($query);
        while ($row = $dba->fetch_array($result))
        {
            $res[$row['parent_id']][$row['id']] = $row;
        }


        $post_test['data'] = $res;
        $post_test['success'] = TRUE;
        echo json_encode($post_test);
        exit;
    }

    if(isset($params['lang_id']) && isset($params['get_Groups']))
    {

        $lang_id = $params['lang_id'];
        $dba = App_Db_Table_Abstract::getAdapter();
        $query = "
   		SELECT a_t.id, atc.label as name
   		FROM bs_transaction_types AS a_t
			LEFT JOIN bs_transaction_types_content AS atc
				ON atc.tr_type_id = a_t.id
					AND atc.lang_id = $lang_id
   		WHERE a_t.parent_id =".constant('ROOT_ID_SELECT')."
   		ORDER BY a_t.order_in_list ASC, name ASC
   		";
        $res = array();
        $result = $dba->query($query);
        while ($row = $dba->fetch_array($result))
        {
            $res[$row['id']] = $row['name'];
        }
        $post_test['data'] = $res;
        $post_test['success'] = true;
        echo json_encode($post_test);
        exit;
    }
    $files_data = $params['files_data'];
    //Logger::logDebugInformation($post_data);
    if(isset($post_data['tr_id']) && isset($post_data['case_id']))
    {
        $tr_id = $post_data['tr_id'];
        $all_data['case_id'] = $post_data['case_id'];
        $tr_data = array('app_id'=>$params['app_id'],'case_id' => $all_data['case_id'],'notary_id' => $params['notary_id'],'tr_type_id' => $post_data['app_type']);
        $all_data['tr_id'] = $oTransactions->updateTransaction($tr_id, $tr_data);
    }
    else{
        $oCases = new Cases();
        $all_data['case_id'] = $oCases->addCase(
            array(
                'input_user_id' => App_Registry::get('temp_sn')->user_id,
                'notary_id' => $params['notary_id']
            )
        );
        $tr_data = array('app_id'=>$params['app_id'],'case_id' => $all_data['case_id'],'notary_id' => $params['notary_id'],'tr_type_id' => $post_data['app_type']);
        $all_data['tr_id'] = $oTransactions->addTransaction($tr_data);
    }



    $oApplication_Messages = new Application_Messages();
    
    $data_message = array('app_id' => $params['app_id'],'message' => $post_data['app_description'],'customer_id' => $params['customer_id']);
    //Logger::logDebugInformation($data_message);
    $oApplication_Messages->addMessage($data_message);
    //Logger::logDebugInformation($files_data);
    //Logger::logDebugInformation($post_data);
    
    

    $oTransactionStatus = new Transactions_Status();
    $oTransactionStatus->setTransactionStatus($all_data['tr_id'], Transaction_Statuses::STATUS_NEW_ONLINE);

    
    $oDoc = new Documents();
    $oDocFiles = new Document_Files();
    
    $oRelationship = new Transaction_Relationships();
    $relationship_id = $oRelationship->addRelationship($all_data);
    foreach($files_data as $key=>$file)
    {
        if($file['belongs_to'] == 'relationship')
        {
            $doc_dt_id = $oDoc->addDocument(array(
                'doc_type_code' => $file['doc_type'],
                'case_id' => $all_data['case_id'],
                'page_count' => 0,
                'rel_id' => $relationship_id
            ))->dt_id;
            $result = $oTransactions->db_select('cases',array('case_code'), array('id'=>$case_id));
            if($row = $oTransactions->db_fetch_row($result))
            {
                $case_code = $row[0];
            }
            $oDocFiles->insert($doc_dt_id, array($file['code']=>$_FILES[$file['code']]), $case_code);
        }
    }
    $oParty = new Transaction_Relationship_Parties();
    $all_data['rel_id'] = $relationship_id;
    $oSubjects = new Transaction_Relationship_Party_Subjects();
    $subjects = array();
    
    foreach($post_data['subjects'] as $party_key => $party)
    {
        $all_data['party_type_code'] = $party['party_type'];
        $party_id = $oParty->addParty($all_data);
        if(isset($party['NP']))
        {
            foreach($party['NP'] as $subject_key => $subject)
            {
                $subject['serviceData'] = (array) App_Json::decode($subject['customer_info']);
                if(empty($subject['serviceData']))
                {
                    $subject['serviceData']['first_name'] = $subject['first_name'];
                    $subject['serviceData']['last_name'] = $subject['last_name'];
                    $subject['serviceData']['passport_number'] = $subject['passport'];
                    $subject['serviceData']['from_portal'] = 1;
                }
                $subject['party_id'] = $party_id;
                $subject['n_contact_id'] = 0;
                $subject['contactType'] = 'natural';
                $subject_id = $oSubjects->addSubject($subject);
                foreach($files_data as $key=>$file)
                {
                    if($file['belongs_to'] == 'subjects' && $file['doc_type'] == 'passport' && $file['party_number'] == $party_key && $file['subject_num'] == $subject_key)
                    {
                        $doc_dt_id = $oDoc->addDocument(array(
                            'subject_id' => $subject_id,
                            'doc_type_code' => $file['doc_type'],
                            'case_id' => $all_data['case_id'],
                            'page_count' => 0,
                        ))->dt_id;
                        $result = $oTransactions->db_select('cases',array('case_code'), array('id'=>$all_data['case_id']));
                        if($row = $oTransactions->db_fetch_row($result))
                        {
                            $case_code = $row[0];
                        }
                        $oDocFiles->insert($doc_dt_id, array($file['code']=>$_FILES[$file['code']]), $case_code);
                    }
                }
                if(isset($post_data['edit']['subjects']))
                {
                    Logger::logDebugInformation($post_data['edit']['subjects']);
                    foreach ($post_data['edit']['subjects'] as $party_key_edit => $party_edit) {
                        foreach ($party_edit as $subject_key_edit => $file_id_edit) {
                            Logger::logDebugInformation($party_key_edit.'_'.$party_key.'____'.$subject_key_edit.'_'.$subject_key);
                            if($party_key_edit == $party_key && $subject_key_edit == $subject_key && !empty($file_id_edit))
                            {
                                $doc_dt_id = $oDoc->addDocument(array(
                                    'subject_id' => $subject_id,
                                    'doc_type_id' => '3499',
                                    'case_id' => $all_data['case_id'],
                                    'page_count' => 0,
                                ))->dt_id; 
                                $oDocFiles->update($doc_dt_id, $file_id_edit);
                            }
                        }
                    }
                }
            }
        }

        if(isset($party['JP']))
        {
            foreach($party['JP'] as $subject_key => $subject)
            {
                
                $subject['serviceData'] = (array) App_Json::decode($subject['customer_info']);
                if(empty($subject['serviceData']))
                {
                    $subject['serviceData']['organization_name'] = $subject['organization_name'];
                    $subject['serviceData']['registration_number'] = $subject['registration_number'];
                    $subject['serviceData']['from_portal'] = 1;
                }
                $subject['party_id'] = $party_id;
                $subject['j_contact_id'] = 0;
                $subject['contactType'] = 'juridical';
                $subject_id = $oSubjects->addSubject($subject);
                foreach($files_data as $key=>$file)
                {
                    if($file['belongs_to'] == 'subjects' && $file['doc_type'] == 'legal_entity_reg_certificate' && $file['party_number'] == $party_key && $file['subject_num'] == $subject_key)
                    {
                        $doc_dt_id = $oDoc->addDocument(array(
                            'subject_id' => $subject_id,
                            'doc_type_code' => $file['doc_type'],
                            'case_id' => $all_data['case_id'],
                            'page_count' => 0
                        ))->dt_id;
                        $result = $oTransactions->db_select('cases',array('case_code'), array('id'=>$all_data['case_id']));
                        if($row = $oTransactions->db_fetch_row($result))
                        {
                            $case_code = $row[0];
                        }
                        $oDocFiles->insert($doc_dt_id, array($file['code']=>$_FILES[$file['code']]), $case_code);
                    }
                }
                                if(isset($post_data['edit']['subjects']))
                {
                    Logger::logDebugInformation($post_data['edit']['subjects']);
                    foreach ($post_data['edit']['subjects'] as $party_key_edit => $party_edit) {
                        foreach ($party_edit as $subject_key_edit => $file_id_edit) {
                            Logger::logDebugInformation($party_key_edit.'_'.$party_key.'____'.$subject_key_edit.'_'.$subject_key);
                            if($party_key_edit == $party_key && $subject_key_edit == $subject_key && !empty($file_id_edit))
                            {
                                $doc_dt_id = $oDoc->addDocument(array(
                                    'subject_id' => $subject_id,
                                    'doc_type_id' => '3506',
                                    'case_id' => $all_data['case_id'],
                                    'page_count' => 0,
                                ))->dt_id; 
                                $oDocFiles->update($doc_dt_id, $file_id_edit);
                            }
                        }
                    }
                }
            }
        }


    }

    $oObject = new Transaction_Relationship_Objects();
    foreach($files_data as $key=>$file)
    {
        if($file['belongs_to'] == 'objects')
        {
            $obj_data['object_type_id'] = 8;
            $obj_data['doc_type'] = $file['doc_type'];
            $obj_data['rel_id'] = $relationship_id;
            $object_id = $oObject->addObjectPortal($obj_data);
            $doc_dt_id = $oDoc->addDocument(array(
                'object_id' => $object_id,
                'doc_type_id' => array('value'=>"getDocumentTypeIdByCode('".$file['doc_type']."')", 'escape' => false),
                'case_id' => $all_data['case_id'],
                'page_count' => 0
            ))->dt_id;
            //$oObjectProperties->addProperty($object_id,27,$file['doc_type']);

            $documentType = $oDocType->getDocLabelByDocType($file['doc_type']);
            $oObjectProperties->addProperty($object_id,27,$documentType);

            $result = $oTransactions->db_select('cases',array('case_code'), array('id'=>$all_data['case_id']));
            if($row = $oTransactions->db_fetch_row($result))
            {
                $case_code = $row[0];
            }
            $oDocFiles->insert($doc_dt_id, array($file['code']=>$_FILES[$file['code']]), $case_code);
        }
    }
    //Logger::logDebugInformation($post_data['edit']);
    //Logger::logDebugInformation($post_data['subjects']);
    
    if(isset($post_data['tr_id']) && isset($post_data['case_id'])){
        if(!empty($post_data['edit']['relationship'])){
            foreach ($post_data['edit']['relationship'] as $key => $file_id){
                if(!empty($file_id))
                {
                    $doc_dt_id = $oDoc->addDocument(array(
                        'doc_type_code' => $key,
                        'case_id' => $post_data['case_id'],
                        'page_count' => 0,
                        'rel_id' => $relationship_id
                    ))->dt_id;
                    $oDocFiles->update($doc_dt_id, $file_id);
                }
            }
        }
        if(!empty($post_data['edit']['objects'])){
            foreach ($post_data['edit']['objects'] as $key => $file_id){
                if(!empty($file_id))
                {
                    //Logger::logDebugInformation($post_data['edit']['objects']);
                    $obj_data['object_type_id'] = 8;
                    $obj_data['doc_type'] = $key;
                    $obj_data['rel_id'] = $relationship_id;
                    $object_id = $oObject->addObjectPortal($obj_data);
                    $doc_dt_id = $oDoc->addDocument(array(
                        'object_id' => $object_id,
                        'doc_type_code' => $key,
                        'case_id' => $post_data['case_id'],
                        'page_count' => 0,
                    ))->dt_id;
                    $oDocFiles->update($doc_dt_id, $file_id);
                    //$oObjectProperties->addProperty($object_id,27,$key);
                    $documentType = $oDocType->getDocLabelByDocType($key);
                    $oObjectProperties->addProperty($object_id,27,$documentType);
                }
            }
        }
        
    }
    
    //Logger::logDebugInformation($post_data);

        if(isset($post_data['cars'])){
            foreach ($post_data['cars'] as $key => $car){
                $car_data = $car['car_data'];
                if(!empty($car_data))
                {
                    //Logger::logDebugInformation($car_data);
                    $car_data = json_decode($car_data);
                    //Logger::logDebugInformation($car_data);
                    $vin = $car_data[0]->vin;
                    $number = $car_data[0]->number;
                    //unset($car_data[0]->vin);
                    //unset($car_data[0]->number);
                    $car_data[0] = (array) $car_data[0];
                    $car_data = $car_data[0];                   
                    $obj_data['object_type_id'] = 2;
                    $obj_data['rel_id'] = $relationship_id;
                    $object_id = $oObject->addObjectPortal($obj_data);
                    $oObjectProperties->addProperty($object_id,25,$number);
                    $oObjectProperties->addProperty($object_id,24,$vin);
                    $oObjectProperties->addProperty($object_id,23,$car_data);
                }
                else{
                    if(strlen($car['data']) == 7)
                    {
                        $pr_id = 25;
                    }
                    else{
                        $pr_id = 24;
                    }
                    $obj_data['object_type_id'] = 2;
                    $obj_data['rel_id'] = $relationship_id;
                    $object_id = $oObject->addObjectPortal($obj_data);
                    $oObjectProperties->addProperty($object_id,$pr_id,$car['data']);
                    foreach($files_data as $key=>$file)
                    {  
                        if($file['belongs_to'] == 'cars' && $file['doc_type'] == $key)
                        {
                            $doc_dt_id = $oDoc->addDocument(array(
                                'object_id' => $object_id,
                                'doc_type_id' => 3526,
                                'case_id' => $all_data['case_id'],
                                'page_count' => 0
                            ))->dt_id;
                            $result = $oTransactions->db_select('cases',array('case_code'), array('id'=>$all_data['case_id']));
                            if($row = $oTransactions->db_fetch_row($result))
                            {
                                $case_code = $row[0];
                            }
                            $oDocFiles->insert($doc_dt_id, array($file['code']=>$_FILES[$file['code']]), $case_code);
                        }
                    }
                }

            }   
        }
        

    $oTransactions->db_commit();


$response =  array(
    'tr_id' => $tr_id,
    'rel_id' => $rel_id
);

Ext::sendResponse(true, array(
        'data' => $response
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oTransactions) $oTransactions->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}

