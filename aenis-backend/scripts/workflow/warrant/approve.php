<?php
user_auth_check();

$oWarrants = null;

try{
	$oWarrants = new Warrants();
    $oWarrants->approveWarrant($_POST, $_FILES);

    $oWarrants->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oWarrants) $oWarrants->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
