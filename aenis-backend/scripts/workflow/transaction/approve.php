<?php
user_auth_check();

$oTransaction = null;

try{
    $oTransaction = new Transactions();
    $oTransaction->approveTransaction($_POST, $_FILES);

    $oTransaction->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oTransaction) $oTransaction->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
