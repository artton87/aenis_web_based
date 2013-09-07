<?php

class Applications extends Transactions {

    const APP_STORAGE_PATH = 'applications/%s/app_%d/';
    const DOC_TYPE_PAYMENT_RECEIPT = 16;

    const BASE_SERVICE_FEE = 1000;
    const BASE_STATE_FEE = 1000;
    const STORAGE_ID = 1;


        /**
     * Generate and send receipt for online payment by given log and customer data
     * 
     * @param type $log
     * @param type $customer
     */
    public function sentReceipt($details,$data,$customer,$PAYMENT_CONSTANTS)
    {
        $storage_id = self::STORAGE_ID;
        $back_image = imagecreatefromgif('resources/arca.gif');
        
        $black = imagecolorallocate($back_image, 0, 0, 0);
        $white = imagecolorallocate($back_image, 255, 255, 255);
        
        $font_size = 9;
        $padding_left = 95;   
        $font_file = 'resources/arnamub.ttf';
                              
        //data and amount
        imagefttext($back_image, $font_size, 0, 200, 26, $black, $font_file, stripslashes($details['datetime']));
        imagefttext($back_image, $font_size, 0, 198, 55, $black, $font_file, $details['amount'] . ' AMD');
                                   
        //cardNumber
        imagefttext($back_image, $font_size, 0, $padding_left, 95, $white, $font_file, $details['cardNumber']);
        //clientName
        imagefttext($back_image, $font_size, 0, $padding_left, 119, $white, $font_file, $details['clientName']);
        //user
        imagefttext($back_image, $font_size, 0, $padding_left, 143, $white, $font_file, htmlspecialchars($customer['name'].' '.$customer['last_name']));
        //orderID
        imagefttext($back_image, $font_size, 0, $padding_left, 174, $white, $font_file, $details['orderID']);
        
        if($data['gateway'] == $PAYMENT_CONSTANTS['GATEWAY_ARCA'])
        {
             //mid
            imagefttext($back_image, $font_size, 0, $padding_left, 198, $white, $font_file, $PAYMENT_CONSTANTS['CFG_ARCA_MERCHANT_ID']);
            //tid
            imagefttext($back_image, $font_size, 0, $padding_left, 222, $white, $font_file, $PAYMENT_CONSTANTS['CFG_ARCA_TERMINAL_ID']);
        }
        else
        if($data['gateway'] == $PAYMENT_CONSTANTS['GATEWAY_EPAYMENTS'])
        {
            //mid
            imagefttext($back_image, $font_size, 0, $padding_left, 198, $white, $font_file, '-');
            //tid
            imagefttext($back_image, $font_size, 0, $padding_left, 222, $white, $font_file, '-');
        }
        
        //authcode
        imagefttext($back_image, $font_size, 0, $padding_left, 246, $white, $font_file, $details['authcode']);
        //rrn
        imagefttext($back_image, $font_size, 0, $padding_left, 269, $white, $font_file, $details['rrn']);
		  
        //account number        
        imagefttext($back_image, $font_size, 0, $padding_left, 303, $white, $font_file, $details['account_number']);    
        //purpose
        imagefttext($back_image, $font_size - 3, 0, $padding_left, 325, $white, $font_file, wordwrap($details['description'], 98, "\n"));
       
		
        //footer
        imagefttext($back_image, $font_size, 0, 210, 430, $black, $font_file, 'E-NOTARY.AM');
        
        $oDocuments = new Documents();
        $oDocument_Files = new Document_Files();
        $oTransactions = new Transactions();
        $oRelationships = new Transaction_Relationships();
        $transaction = $oTransactions->getTransactionByAppId($data['app_id']);
        $result = $oRelationships->getRelationships(array('transaction_id' => $transaction['id']));
        while($row = $this->db_fetch_array($result))
        {
            $rel_id[] = $row['id'];
        }
        $rel_id = $rel_id[0];
        $document_data = array(
                        'case_id' => $transaction['case_id'],
			'rel_id' => $rel_id,
			'page_count' => 0
        );
        $case_id = $transaction['case_id'];
        $query = "SELECT case_code FROM bs_cases WHERE id='$case_id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $case_codes[] = $row['case_code'];
        }
        $case_code = $case_codes[0];
        $doc_dt_id = $oDocuments->addDocument($document_data);

        
        $query = "SELECT path FROM bs_storage WHERE id='$storage_id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $paths[] = $row['path'];
        }
        $path = $paths[0];
        $path_to_save = $path.$case_code.'/'.'recipt_'.date('y-m-d').'.png';
        $oDocument_Files->db_insert('bs_files', array('file_path' => $case_code.'/','file_name' => '', 'storage_id' => $storage_id));
        $file_id = $oDocument_Files->db_insert_id();      
        $oDocument_Files->db_insert('bs_document_files', array('doc_dt_id' => $doc_dt_id, 'file_id' => $file_id));
        imagepng($back_image, CFG_FILE_STORAGE.$path_to_save);
        
        return $path_to_save;
    }
    

    
    /**
     * Get application row by application id
     * 
     * @param type $id
     */
    public function getApp($id)
    {
        $query = "SELECT * FROM bs_applications WHERE id='$id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $applications[] = $row;
        }
        return $applications[0];
    }

        /**
     * Վերադարձնում է դիմումների տվյալները
     * @access public
     * @param array $search    Ասո�?իատիվ մասիվ որոնման պարամետրերով
     * @return mysqli_result
     */

    private function make_date_for_getApp_from($date)
    {
        $data_array = explode('-',$date);
        $return = $data_array[0].'-'.$data_array[1].'-'.$data_array[2].' 00:00:00';
        return $return;
    }
    
    private function make_date_for_getApp_to($date)
    {
        $data_array = explode('-',$date);
        $return = $data_array[0].'-'.$data_array[1].'-'.$data_array[2].' 23:59:59';
        return $return;
    }
    /**
     * Gets aplication data(notary_id,app_type_id) by app_id for portals payment
     * 
     * @param type $app_id
     * @return app_data
     */
    public function getApplication_data($app_id)
    {
        $query = "SELECT
                transaction.notary_id,transaction.tr_type_id,transactions_status.tr_status_id,(SELECT
                CASE WHEN COUNT(is_paid) = SUM(is_paid) THEN '1'
                ELSE '0' END AS payed
                FROM bs_payments
                WHERE transaction_id =transaction.id) AS is_paid FROM bs_applications applications
                         LEFT JOIN bs_transactions transaction ON transaction.app_id=applications.id
                         LEFT JOIN bs_transactions_status transactions_status ON transactions_status.tr_id=transaction.id
                         WHERE applications.id=$app_id";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $app_data[] = $row;
        }
        return $app_data[0];
    }

    /**
     * gets list of applications for e-notary portal
     * @param $search
     * @param bool $b_count
     * @return mysqli result
     */
    public function getApplications($search, $b_count = false) {
        $where = array();
        $dba = $this->getAdapter();
        $lang_id = $search['lang_id'];

        $search['limit'] = $search['items_per_page'];
        $page = $search['current_page'];
        if(!empty($search['from']) && !empty($search['to']))
        {
            $from = $this->make_date_for_getApp_from($search['from']);
            $from = $dba->escape_string($from);
            $to = $this->make_date_for_getApp_to($search['to']);
            $to = $dba->escape_string($to);
           //$where[] = "applications.app_date >= '$from' AND applications.app_date <= '$to'";
           $where[] = "DATE_FORMAT(applications.app_date,'%Y-%m-%d %H:%i:%s') BETWEEN '$from' AND '$to'";
           
           

        }
        
        if(!empty($search['statuses']))
        {
            $statuses = $search['statuses'];
            $statuses = explode(',',$statuses);
            foreach($statuses as $status)
            {
                $where[] = "status.tr_status_id != $status";
            }
                $where[] = "status.tr_status_id != ".Transaction_Statuses::STATUS_TERMINATED;
        }
        else{
            $where[] = "status.tr_status_id != ".Transaction_Statuses::STATUS_TERMINATED;
        }



        if (!empty($search['customer_id']))
            $where[] = 'applications.customer_id = ' . $dba->escape_string($search['customer_id']);
            $where[] = 'tr.new_id IS NULL AND tr.locked_user_id IS NULL AND tr.del_user_id IS NULL';
            $where[] = 'status.new_id IS NULL';
            $where[] = 'users.is_notary = 1';
            $where[] = "types_content.lang_id='$lang_id'";
            
        $where = (count($where) > 0) ? 'WHERE ' . implode(' AND ', array_unique($where)) : '';

        if (!empty($search['limit']))
            $qLimit = "LIMIT " . $dba->escape_string($search['limit'])*($page-1).",".$search['items_per_page'];

        if(!$b_count)
        {
            $select = "applications.id, applications.customer_id,statuses.title,statuses.id statuses_id,
                 applications.app_date,getUserFullName(users.id, '$lang_id') full_name,
                 types_content.label,(SELECT 
CASE WHEN COUNT(is_paid) = SUM(is_paid) THEN '1'
ELSE '0' END AS payed
FROM bs_payments
WHERE transaction_id =tr.id) AS is_paid";
        }
        else{
            $select = "COUNT(*)";
            $qLimit = '';
        }
        $q = "SELECT $select
			FROM bs_applications AS applications
			LEFT JOIN bs_transactions tr ON tr.app_id = applications.id
			LEFT JOIN bs_transactions_status status ON status.tr_id = tr.id
			LEFT JOIN bs_transaction_statuses statuses ON statuses.id = status.tr_status_id
			LEFT JOIN bs_users users ON users.id = tr.notary_id
			LEFT JOIN bs_transaction_types types ON types.id = tr.tr_type_id
			LEFT JOIN bs_transaction_types_content types_content ON types_content.tr_type_id = types.id
            $where
            ORDER BY applications.app_date DESC
            $qLimit 
		";
        //Logger::logDebugInformation($q);
        $result = $dba->query($q);
        if($b_count)
        {
            if($row = $this->db_fetch_row($result))
            {
                return $row[0];
            }
            return 0;
        }

        return $result;
    }


    /**
     * Ավելա�?նել նոր դիմում
     * @access public
     * @param array $data    Ասո�?իատիվ զանգված applications աղյուսակի տվյալներով
	 * @return integer    ID of newly added application
     */
    public function addApplications($data)
	{
        $this->db_insert('applications', array(
			'customer_id' => $data['customer_id'],
			'app_date' => self::$DB_TIMESTAMP
		));

		$app_id = $this->db_insert_id();

		/*$this->db_insert('transactions', array(
			'app_id' => $app_id,
			'notary_id' => $data['notary_id'],
			'is_deleted' => 0,
			'lu_user_id' => App_Registry::get('temp_sn')->user_id,
			'lu_date' => self::$DB_TIMESTAMP
		));*/

        return $app_id;
    }

    
    /**
     * Return customer_id by application id for portal
     *
     * @param type $app_id
     * @return type 
     */
    public function is_app_customer($app_id)
    {
        $query = "SELECT customer_id FROM bs_applications WHERE id='$app_id' LIMIT 1";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $return[] = $row['customer_id'];
        }
        return $return[0];
    }

    /**
     * Return customer id by image id for portal
     *
     * @param type $img_id 
     */
    public function is_file_customer($file_id)
    {       
        /*$result = $this->db_select('',
                array(array('value'=>'getFileIdByCustomerId($file_id)',
                    'escape'=>false) => 'file_id')
                );*/
        $query = "SELECT getCustomerIdByFileId($file_id) customer_id";       
        $result  = $this->db_query($query);       
        while($row = $this->db_fetch_array($result))
        {
            $return[] = $row['customer_id'];
        }
        return $return[0];
    }

    /**
     * gets list of online applications
     * @param $search
     * @param $start
     * @param $limit
     * @param bool $returnCount
     * @return mysqli result
     */
    public function getOnlineApplications($search = array(), $start = 0, $limit = 0, $returnCount = false)
    {
        $oLanguages = new Languages();
        $default_lang_id = $oLanguages->getDefaultLanguage()->id;

        $where = array(
            'tr.app_id IS NOT NULL',
            'tr.new_id IS NULL',
            'tr.del_user_id IS NULL',

            'tr.notary_id = '.App_Registry::get('temp_sn')->user_id.''

        );
        $joins = array();
        $joins = implode(', ', array_unique($joins));

        if($returnCount)
        {
            $where = implode(' AND ', array_unique($where));
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
            if(!empty($search['tr_status_id']))
                $where[] = 'tr_status.tr_status_id = '.intval($search['tr_status_id']).'';

            if (!empty($search['lu_date'])){
                $where[] = 'DATE_FORMAT("'.$search['lu_date'].'", "%Y-%m-%d") = DATE_FORMAT(tr.lu_date, "%Y-%m-%d")';
            }

            if (!empty($search['start_date']) && !empty($search['end_date'])){
                $where[] = 'DATE_FORMAT(tr.lu_date,"%d/%m/%Y") BETWEEN "'.$this->db_escape_string($search['start_date']).' 00:00:00" AND "'.$this->db_escape_string($search['end_date']).' 00:00:00"';
            }

            $where[] = 'transaction_types_content.lang_id = "'.intval($default_lang_id).'"';

            $where = implode(' AND ', array_unique($where));

            $limit = intval($limit);
            $start = intval($start);
            $limit = ($limit > 0) ? "LIMIT $start, $limit" : '';


            $q = "SELECT
                    tr.app_id,
					tr.id,
					tr.lu_date AS input_date,
					getUserFullName(tr.lu_user_id, $default_lang_id) AS lu_user,
					tr.notary_id,
					customers.id AS customer_id,
					CONCAT(customers.name,' ',customers.middle_name,' ',customers.last_name) AS customer,
					transaction_statuses.id AS tr_status_id,
					transaction_statuses.code AS tr_status_code,
					transaction_statuses.title AS tr_status_title,
					transaction_types_content.label,
					tr_types.ui_type
				FROM  bs_transactions tr
				LEFT JOIN bs_transactions_status tr_status ON tr_status.tr_id = tr.id AND tr_status.del_user_id IS NULL AND tr_status.new_id IS NULL
				LEFT JOIN bs_transaction_statuses transaction_statuses ON transaction_statuses.id = tr_status.tr_status_id
				LEFT JOIN bs_transaction_types tr_types ON tr.tr_type_id = tr_types.id
				LEFT JOIN bs_transaction_types_content transaction_types_content  ON tr_types.id = transaction_types_content.tr_type_id
				INNER JOIN bs_applications applications ON tr.app_id = applications.id
				LEFT JOIN bs_customers customers ON customers.id = applications.customer_id
				WHERE $where
				ORDER BY tr.id DESC
			    $limit
           ";
            //echo $q;die;
           return $this->db_query($q);
        }
    }

    /**
     * approves an online application
     * @access public
     * @param integer $id    application id
     * @param array $data     Associative array with 'transactions' database table field values
     * @throws App_Db_Exception_Table if contract id is not specified
     * @return integer    ID of newly inserted record
     */
    public function approveApplication($id, $data)
    {
        if(empty($id))
            throw new App_Db_Exception_Table('Online application ID is not specified');

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

        $oLanguages = new Languages();
        $lang_id = $oLanguages->getDefaultLanguage()->id;

        $oUsers = new Users();
        $notary = $oUsers->getUserNotary(App_Registry::get('temp_sn')->user_id, $lang_id);

        $notary_office = $oUsers->getNotaryOfficeByUser(App_Registry::get('temp_sn')->user_id, $lang_id);

        Logger::logDebugInformation($notary);

        $subject = 'Բարև հարգելի քաղաքացի';
        if(1 == $data['approve_application'])
        {
            $status = Transaction_Statuses::STATUS_SUBMITTED;
            $bodyText = 'Հարգելի քաղաքացի Ձեր դիմումը ընդունված է, խնդրում ենք ներկայանալ <br />
             '.$notary_office.' '.$data['application_date'].'թ. ժամը '.$data['application_time'].'-ին<br/>
             Ձեր կողմից կցագրված փաստաթղթերի բնօրինակներով հանդերձ: <br />
            Շնորհակալություն, հարգանքներով '.$notary_office.'-ի նոտար '.$notary['first_name'].' '.$notary['second_name'].' '.$notary['last_name'];
        }
        else
        {
            $status = Transaction_Statuses::STATUS_REJECTED;
            $bodyText = 'Հարգելի քաղաքացի Ձեր դիմումի մեջ առկա են անճշտություններ, խնդրում ենք ուղղել<br />
             Ձեր կողմից կցագրված փաստաթղթերի ցանկը և կրկին ուղարկել:<br />
            Շնորհակալություն, հարգանքներով '.$notary_office.'-ի նոտար '.$notary['first_name'].' '.$notary['second_name'].' '.$notary['last_name'];
        }


        $oTransactionStatus = new Transactions_Status();
        $oTransactionStatus->setTransactionStatus($data['tr_id'],$status);

        $oProperties = new Transaction_Properties();
        /*foreach($data['properties'] as $value)
        {
            $oProperties->addProperty($data['tr_id'], $value['id'], $value['value']);
        }*/
        $oProperties->addProperty($data['tr_id'], 'appointment_date', $data['application_date']);
        $oProperties->addProperty($data['tr_id'], 'appointment_time',  $data['application_time']);

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

        // objects part
        if(!empty($data['objects']))
        {
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

        $oMail = new Mail();
        $oMail->sendMail('gdarbinyan@yandex.ru',$notary['email'],$subject,$bodyText);
    }
}