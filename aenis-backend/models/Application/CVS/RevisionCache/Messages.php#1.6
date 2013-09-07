<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Bestsoft
 * Date: 6/26/13
 * Time: 12:12 PM
 * To change this template use File | Settings | File Templates.
 */

class Application_Messages extends App_Db_Table_Abstract
{

    


    protected $_table = 'application_messages';

    /**
     * @param $data
     */
    public function addMessage($data)
    {

        $this->db_insert($this->_table, array(
            'app_id'=>$data['app_id'],
            'message_date' => self::$DB_TIMESTAMP,
            'notary_id' => empty($data['notary_id']) ? self::$DB_NULL : $data['notary_id'],
            'customer_id' => empty($data['customer_id']) ? self::$DB_NULL : $data['customer_id'],
            'message' => $data['message']
        ));
    }

    /**
     * get application messages by given integer application identifier
     * @param $app_id
     * @return mysqli result
     */
    public function getMessages($search = array(), $start = 0, $limit = 0, $returnCount = false)
    {
        $where = array();

        if(!empty($search['message_id']))
            $where[] = "messages.id < '".intval($search['message_id'])."'";

        if(!empty($search['app_id']))
            $where[] =  "messages.app_id='".intval($search['app_id'])."'";

        $where = implode(' AND ', array_unique($where));

        if($returnCount)
        {
            $q = "SELECT
					COUNT(messages.id)
				FROM bs_application_messages messages
				WHERE $where
			";
            $result = $this->db_query($q);
            if($row = $this->db_fetch_row($result))
            {
                return intval($row[0]);
            }
            return 0;
        }

        $oLanguages = new Languages();
        $default_lang_id = $oLanguages->getDefaultLanguage()->id;
        if($start >= 0 && $limit > 0)
            $qLimit = "LIMIT $start, $limit";
        $query = "
              SELECT
                    messages.id,
                    messages.app_id,
                    messages.message_date,
                    messages.customer_id,
                    messages.message,
                    getUserFullName(messages.notary_id, ".$default_lang_id.") AS notary,
                    customer.name AS customer_name,
                    customer.last_name AS customer_last_name
                  FROM
                  bs_application_messages messages
                  LEFT JOIN bs_customers customer ON customer.id = messages.customer_id
              WHERE $where
              ORDER BY messages.message_date DESC
              $qLimit
              ";
        return $this->db_query($query);
    }


























}