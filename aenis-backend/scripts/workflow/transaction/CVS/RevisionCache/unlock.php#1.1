<?php
user_auth_check();

$transaction_id = $_POST['transaction_id'];

$oTransactions = new Transactions();
try
{
	$oTransactions->unLock($transaction_id);
	$oTransactions->db_commit();
    Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    $oTransactions->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
