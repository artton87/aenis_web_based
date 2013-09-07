<?php
user_auth_check();

$oInheritance = null;

try{
    $oInheritance = new Inheritances();
    $oInheritance->approveInheritance($_POST, $_FILES);
    $oInheritance->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oInheritance) $oInheritance->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
