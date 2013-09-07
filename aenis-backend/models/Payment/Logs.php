<?php

class Payment_Logs extends App_Db_Table_Abstract
{
    protected $_table = 'payment_logs';
    
    
    
    /**
     * Insert new row while send request and returns last inserted id
     * 
     * @param type $data_ser
     * @param type $terminal_id
     * @return type
     */
    public function insert_log($data_ser,$terminal_id,$payment_tr_id)
    {
        $this->db_insert($this->_table, array('request_data' => $data_ser,'terminal_id' => $terminal_id,'payment_tr_id' => $payment_tr_id));
        $order_id = $this->db_insert_id();
        return $order_id;
    }
    /**
     * Insert response data 
     * 
     * @param type $data
     */
    public function insert_response($order_id,$data)
    {
        $this->db_update($this->_table, array('response_data' => $data), array('id' => $order_id));
    }
    /**
     * Get log by id
     * 
     * @param type $id
     */
    public function getLog($id)
    {
        $result = $this->db_select($this->_table, array(), array('id' => $id));
        while($row = $this->db_fetch_array($result))
        {
            $answer[] = $row;
        }
        return $answer[0];
    }
    
}
?>