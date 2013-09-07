<?php

class Payment_Services extends App_Db_Table_Abstract
{
    protected $_table = 'payments_services';
    
    
    
    /**
     *Returns table row by given transaction type id
     *  
     * @param type $tr_type_id
     * @return type
     */
    public function get_payment_services($tr_type_id)
    {
        $query = "SELECT * FROM bs_payments_services WHERE tr_type_id='$tr_type_id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $answer[] = $row;
        }
        return $answer[0];
    }
    
    
    
}
?>
