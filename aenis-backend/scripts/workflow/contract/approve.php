<?php
user_auth_check();

$oContract = null;

try{
	$oContract = new Contracts();
    $oContract->approveContract($_POST, $_FILES);
    $oContract->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oContract) $oContract->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
