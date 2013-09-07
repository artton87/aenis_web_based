<?php
user_auth_check();

$oWill = null;

try{
	$oWill = new Wills();
    $oWill->approveWill($_POST, $_FILES);
    $oWill->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oWill) $oWill->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
