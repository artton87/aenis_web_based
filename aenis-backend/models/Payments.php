<?php

class Payments extends App_Db_Table_Abstract
{
    
    protected $_table = 'payments';
    
    /**
     * Returs array of amouts for application
     * 
     * @param type $app_id
     */
    public function getAppPayments($app_id)
    {
        $query = "
                    SELECT
                    payments.type_id,
                    payments.amount,
                    payments.transaction_id,
                    payments.type_id
                    FROM bs_applications applications
                         LEFT JOIN bs_transactions transactions ON transactions.app_id = applications.id
                         LEFT JOIN bs_payments payments ON payments.transaction_id = transactions.id
                         WHERE applications.id='".intval($app_id)."' AND payments.is_paid = 0
                     ";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            if($row['type_id'] == 1)
            {
                $amount['state'] = $row;
            }
            elseif($row['type_id'] == 2)
            {
                $amount['service'] = $row;
            }
        }
        return $amount;
    }


    /**
     * Add payment log id in payments table if payment is successfull
     * 
     * @param type $payment_data
     */
    public function addPaymentOrderId($payment_data)
    {
        if($payment_data['type'] == 'service_fee')
        {
            $type = 2;
        }
        else{
            $type = 1;
        }
        $this->db_update($this->_table, array('payment_log_id' => $payment_data['order_id']), array('transaction_id' => $payment_data['payment_tr_id'],'type' => $type));
    }


    /**
     * adds payments into 'bs_payments' by given associative array $data
     * @param $data
     */
    public function addPayment($data)
    {
        $this->db_insert('payments',array(
                'transaction_id' => $data['transaction_id'],
                'type_id' => $data['type_id'],
                'amount' => $data['amount'],
                'creation_date' => self::$DB_TIMESTAMP
            )
        );
    }
    
}

