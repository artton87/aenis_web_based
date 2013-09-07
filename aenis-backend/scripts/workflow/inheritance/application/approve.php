<?php
user_auth_check();

$oInheritanceApplication = null;

try{
	$oInheritanceApplication = new Inheritance_Applications();
    $oInheritanceApplication->approveInheritanceApplication($_POST, $_FILES);

    $oInheritanceApplication->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oInheritanceApplication) $oInheritanceApplication->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}