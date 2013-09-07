<?php
/**
 * Transactions management
 * @package aenis\Workflow
 */

/**
 * Methods for transactions management
 * @author BestSoft
 * @package aenis\Workflow
 */
class Transactions extends HistoricalTable
{
	/**
	 * Database table name
	 * @var string
	 */
    protected $_table = 'transactions';


	/**
	 * Returns notary id of the given transaction
	 * @access public
	 * @param integer $transaction_id    Transaction id
	 * @return integer    Notary id
	 */
	public function getTransactionNotary($transaction_id)
	{
		$result = $this->db_select('transactions', array('notary_id'), array('id'=>$transaction_id));
		if($row = $this->db_fetch_array($result))
		{
			return intval($row['notary_id']);
		}
		return 0;
	}


    /**
     *Return tr_type label by transaction id
     * @param type $tr_id
     * @param type $lang_id 
     */    
    public function getTr_type($tr_id,$lang_id)
    {
        $query = "SELECT transaction_types_content.label FROM bs_transactions transactions
                         LEFT JOIN bs_transaction_types transaction_types ON transaction_types.id=transactions.tr_type_id
                         LEFT JOIN bs_transaction_types_content transaction_types_content ON transaction_types_content.tr_type_id=transaction_types.id
                         WHERE transaction_types_content.lang_id='$lang_id' AND transactions.id='$tr_id' LIMIT 1";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $return[] = $row['label'];
        }
        return $return[0];
    }
    
    /**
     * Return file tr_id
     * @param $doc_code
     * @param $pass_code
     */
    public function getDocumentTransactionIdPortal($doc_code,$pass_code)
    {
        $query = "SELECT * FROM bs_transactions tr
                    LEFT JOIN bs_transaction_properties tr_pr ON tr.id = tr_pr.tr_id
                    WHERE (transaction_property_type_id = 8 AND value = '$doc_code' AND tr.new_id IS NULL AND tr.del_user_id IS NULL)
                     OR (transaction_property_type_id = 9
                    AND value = '".$pass_code."'
                    AND tr.new_id IS NULL) LIMIT 2
                    ";
      return $this->db_query($query);
    }
	/**
	 * Returns list of transactions
	 * @access public
	 * @param array $search    Array with search criteria
	 * @param integer $start    Starting from which record to return results
	 * @param integer $limit    How many results to return. Set to 0 to get all records.
	 * @param boolean $returnCount    Optional. If given, returns number of matching records
	 * @return mysqli_result|integer    Result with matching records or record count (if $return_count=true)
	 */

    public function getTransactionByAppId($app_id)
    {

        $query = "SELECT * FROM bs_transactions WHERE new_id IS NULL AND app_id='$app_id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $return[] = $row;
        }
        return $return[0];
    }


    /**
     * @param array $search
     * @param int $start
     * @param int $limit
     * @param bool $returnCount
     * @return int
     */
    public function getTransactions($search = array(), $start = 0, $limit = 0, $returnCount = false)
    {
		$where = array();
		$joins = array();

		if(empty($search['transaction_id']))
		{
			$where[] = 'tr.del_user_id IS NULL';
			$where[] = 'tr.new_id IS NULL';
		}
		else
		{
			$where[] = "tr.id = '".intval($search['transaction_id'])."'";
		}

		if(!empty($search['ui_type']))
		{
			$joins[] = 'JOIN bs_transaction_types tr_types ON tr_types.id = tr.tr_type_id';
			$where[] = "tr_types.ui_type = '".$this->db_escape_string($search['ui_type'])."'";
		}

        if(!empty($search['subject_first_name']) && !empty($search['subject_second_name']) && !empty($search['subject_last_name']))
        {
			$contact_search_params = App_Array::pick($search,
				array(
					'subject_first_name' => 'np_first_name',
					'subject_second_name' => 'np_second_name',
					'subject_last_name' => 'np_last_name'
				)
			);

			$contact_ids = array();
            $oNaturalContact = new Contact_Natural();
            $contactResult = $oNaturalContact->getContacts($contact_search_params);
            while($contactRow = $this->db_fetch_array($contactResult))
            {
				$contact_ids[] = $contactRow['contact_id'];
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
					FROM bs_subjects
					JOIN bs_parties parties ON parties.id = subjects.party_id AND parties.del_user_id IS NULL AND parties.new_id IS NULL
					JOIN bs_relationships rel ON rel.id = parties.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL
					WHERE subjects.del_user_id IS NULL
						  AND rel.tr_id = tr.id
						  AND subjects.n_contact_id IN (".implode(',', $contact_ids).")
					LIMIT 1
				) IS NOT NULL";
			}
        }

        if(Acl()->allowed('transactions.show_notary_transactions'))
        {
            $joins[] = 'JOIN bs_staff_user staff_user ON staff_user.user_id = tr.lu_user_id AND staff_user.is_active = 1';
            $joins[] = 'JOIN bs_staff staff ON staff_user.staff_id = staff.id';
            $joins[] = 'JOIN bs_departments dep ON staff.dep_id = dep.id AND dep.notarial_office_id = '.App_Registry::get('temp_sn')->notarial_office_id;
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
					getUserFullName(tr.notary_id, $default_lang_id) AS notary,
					getUserFullName(tr.lu_user_id, $default_lang_id) AS lu_user,
					getUserFullName(tr.del_user_id, $default_lang_id) AS del_user,
					getUserFullName(tr.locked_user_id, $default_lang_id) AS locked_user,
					customers.name,
					customers.middle_name,
					customers.last_name,
					transaction_statuses.code AS tr_status_code,
					transaction_statuses.title AS tr_status_title,
					tr_types_content.label AS tr_type_label,
					cases.case_code,
					tr_types.service_fee_coefficient_min,
					tr_types.service_fee_coefficient_max
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
				LEFT JOIN bs_applications apps ON apps.id = tr.app_id
				LEFT JOIN bs_customers customers ON customers.id = apps.customer_id
				LEFT JOIN bs_transactions_status tr_status ON tr_status.tr_id = tr.id AND tr_status.del_user_id IS NULL
				LEFT JOIN bs_transaction_statuses transaction_statuses ON transaction_statuses.id = tr_status.tr_status_id
                LEFT JOIN bs_cases cases ON tr.case_id = cases.id
           ";
            //echo $q;die;
			return $this->db_query($q);
		}
    }


    /**
     * Add new transaction
	 * @access public
     * @param array $data     Associative array with 'transactions' database table field values
     * @return integer    ID of newly added record from 'transactions' table
     */
    public function addTransaction($data)
    {
		$insert_data = array(
			'app_id' => empty($data['app_id']) ? self::$DB_NULL : $data['app_id'],
			'case_id' => empty($data['case_id']) ? self::$DB_NULL : $data['case_id'],
			'parent_id' => empty($data['parent_id']) ? self::$DB_NULL : $data['parent_id'],
			'notary_id' => $data['notary_id'],
			'tr_type_id' => $data['tr_type_id'],
			'locked_user_id' => empty($data['locked_user_id']) ? self::$DB_NULL : $data['locked_user_id']
		);
		return $this->insertUsingAdjacencyListModel($insert_data);
    }


    /**
     * Updates a transaction
	 * @access public
	 * @param integer $tr_id    Transaction id
     * @param array $data     Associative array with 'transactions' database table field values
     * @throws App_Db_Exception_Table if transaction id is not specified
	 * @return integer    ID of newly inserted record
     */
    public function updateTransaction($tr_id, $data)
    {
        if(empty($tr_id))
            throw new App_Db_Exception_Table('Transaction ID is not specified');

		$insert_data = array(
			'app_id' => empty($data['app_id']) ? self::$DB_NULL : $data['app_id'],
			'case_id' => empty($data['case_id']) ? self::$DB_NULL : $data['case_id'],
            'parent_id' => empty($data['parent_id']) ? self::$DB_NULL : $data['parent_id'],
			'notary_id' => $data['notary_id'],
			'tr_type_id' => $data['tr_type_id'],
			'locked_user_id' => empty($data['locked_user_id']) ? self::$DB_NULL : $data['locked_user_id']
		);
		$new_transaction_id = $this->updateUsingAdjacencyListModel($tr_id, $insert_data);

		//do not leave transaction in locked state
		$this->unLock($tr_id);

		return $new_transaction_id;
    }


	/**
	 * Checks if transaction is locked
	 * @param integer $transaction_id    Transaction ID
	 * @return integer     ID of user, who locked the transaction if any
	 */
	public function isLocked($transaction_id)
    {
        $result = $this->db_select($this->_table, array('locked_user_id'),
            array('id'=>$transaction_id, 'locked_user_id IS NOT NULL AND locked_user_id <>'.App_Registry::get('temp_sn')->user_id)
		);
		if($row = $this->db_fetch_row($result))
		{
			return $row[0];
		}
        return 0;
    }


	/**
	 * Locks given transaction
	 * @access public
	 * @param integer $transaction_id    Transaction id to lock
	 */
	public function lock($transaction_id)
	{
        $this->db_update($this->_table,
            array(
                'locked_user_id' => App_Registry::get('temp_sn')->user_id
            ),
            array('id'=>$transaction_id, 'locked_user_id IS NULL')
        );
	}


    /**
     * Unlocks given transaction
	 * @access public
     * @param integer $transaction_id    Transaction id to unlock
	 * @throws App_Db_Exception_Table if transaction id is not specified
     */
    public function unLock($transaction_id)
    {
		if(empty($transaction_id))
			throw new App_Db_Exception_Table('Transaction id is not specified');
        $this->db_update($this->_table, array('locked_user_id' => self::$DB_NULL), array('id'=>$transaction_id));
    }


	/**
	 * Unlocks all transactions locked by the logged-in user except the given one
	 * @access public
	 * @param integer $transaction_id    Transaction id to unlock
	 */
	public function unLockOthers($transaction_id)
	{
		$this->db_update(
			$this->_table,
			array('locked_user_id' => self::$DB_NULL),
			array(
				'locked_user_id' => App_Registry::get('temp_sn')->user_id,
				'id <> '.$transaction_id,
				'new_id IS NULL'
			)
		);
	}


	/**
	 * Generates random string of specified length
	 * @param integer $length    Length of generated password. Defaults to 6.
	 * @return string
	 */
	public function generatePassword($length = 6)
	{
		$chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';

		$str = '';
		$max = strlen($chars) - 1;

		for($i=0; $i<$length; ++$i)
		{
			$str .= $chars[rand(0, $max)];
		}
		return $str;
	}


	/**
	 * Returns uploaded files by the given hash.
	 * A hash is treated as first-level key in $_FILES array.
	 * @access public
	 * @param string $hash    A hash
	 * @return object    An object with 'files' and 'file_doc_type_id_map' properties
	 */
	public function getUploadedFiles($hash)
	{
		$file_doc_type_id_map = array();
		$files = array();
		if(isset($_FILES[$hash]))
		{
			foreach($_FILES[$hash]['name'] as $doc_type_id=>$name)
			{
				if($name == '') continue; //skip empty files
				$file_key = $doc_type_id.'_'.$hash;
				$files[$file_key] = array();
				$properties = array_keys($_FILES[$hash]);
				foreach($properties as $property)
				{
					$files[$file_key][$property] = $_FILES[$hash][$property][$doc_type_id];
				}
				$file_doc_type_id_map[$file_key] = $doc_type_id;
			}
		}
		$ret = new stdClass;
		$ret->files = $files;
		$ret->fileKey_docTypeId_map = $file_doc_type_id_map;
		return $ret;
	}

    /**
     * get transaction property value
     * @param $transaction_id
     * @param $property_code
     * @return bool
     */
    public function getTransactionPropertyValue($transaction_id, $property_code)
    {
        $q = "
        SELECT
            getTransactionPropertyValue(".$transaction_id.",'".$property_code."') AS value,
            transaction_property_types.label
            FROM bs_transactions transactions
            LEFT JOIN bs_transaction_properties transaction_properties ON transactions.id = transaction_properties.tr_id
            LEFT JOIN bs_transaction_property_types transaction_property_types ON transaction_properties.transaction_property_type_id = transaction_property_types.id
            WHERE transaction_property_types.code = '".$property_code."'
            AND transactions.new_id IS NULL AND transactions.del_user_id IS NULL AND transactions.id = ".$transaction_id."
        ";
        $result = $this->db_query($q);
        if($row = $this->db_fetch_array($result))
        {
            return array(
                'value' =>  $row['value'],
                'label' => $row['label']
            );
        }
        return null;
    }


    /**
     * get transaction finish document full path by transaction code and password
     * @param $transaction_document_code - code of document generated by notary
     * @param $transaction_document_pass - password of document
     * @throws App_Db_Exception_Table
     * @return string
     */
    public function getFinishDocumentFullPath($transaction_document_code, $transaction_document_pass)
    {
        if(empty($transaction_document_code))
            throw new App_Db_Exception_Table('Transaction document code is not specified');
        if(empty($transaction_document_pass))
            throw new App_Db_Exception_Table('Transaction document password is not specified');

        $q = "
            SELECT inn.* FROM
                (SELECT files.id AS file_id, files.file_path, files.file_name, storage.path AS storage_path,
                (SELECT VALUE FROM bs_transaction_properties transaction_properties WHERE transaction_properties.transaction_property_type_id = 8 AND transaction_properties.tr_id = tr.id ) AS transaction_code,
                (SELECT VALUE FROM bs_transaction_properties transaction_properties WHERE transaction_properties.transaction_property_type_id = 9 AND transaction_properties.tr_id = tr.id ) AS transaction_password
                FROM bs_transactions tr
                LEFT JOIN bs_relationships rel ON rel.tr_id = tr.id
                LEFT JOIN bs_documents doc ON doc.rel_id = rel.id
                LEFT JOIN bs_documents_dt doc_dt ON doc_dt.doc_id = doc.id
                LEFT JOIN bs_document_files doc_files ON doc_files.doc_dt_id = doc_dt.id
                LEFT JOIN bs_files files ON files.id = doc_files.file_id
                LEFT JOIN bs_storage storage ON storage.id = files.storage_id
                WHERE doc.insert_type = 4 AND doc_dt.is_last = 1) inn
             where inn.transaction_code ='".$transaction_document_code."' and inn.transaction_password = '".$transaction_document_pass."'";
        //Logger::logDebugInformation($q);
        $result = $this->db_query($q);
        if($row = $this->db_fetch_array($result))
        {
            return CFG_FILE_STORAGE.$row['storage_path'].$row['file_path'].$row['file_name'];
        }
        return null;
    }





    /**
     * gets rates by given value|integer tr_type_id|integer
     * @param array $search
     */
    public function getRates($search = array())
    {
        $result = $this->db_select('rates',array(),array('tr_type_id'=>$search['tr_type_id']));
        return $result;
    }

    /**
     * gets payments for given transaction associative array 'search'
     * @param array $search
     * @return mixed
     */
    public function getTransactionPayment($search = array())
    {
        $result = $this->db_select('payments',array(),array('transaction_id'=>$search['tr_id']));
        return $result;
    }

    /**
     * approves payment of given transaction
     * @param $transaction_id
     */
    public function approvePayment($transaction_id)
    {
      $this->db_update('payments',array('is_paid'=>1),array('transaction_id'=>$transaction_id));
    }
}