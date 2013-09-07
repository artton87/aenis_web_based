<?php

user_auth_check();

$transaction_id = $_POST['transaction_id'];

$oTransaction = new Transactions();

try
{
    $oTransaction->approvePayment($transaction_id);
    $oTransaction->db_commit();
    Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    $oTransaction->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}