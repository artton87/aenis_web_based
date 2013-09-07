<?php
user_auth_check();

$oWarrant = null;
try{
    $data = $_POST['data'];
    $data = App_Json::decode($data);
    $id = $data->id;

    $oDocument = new Documents();
    $oDocument->deleteDocument($id);
    $oDocument->db_commit();
    Ext::sendResponse(true, array());
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oWarrant) $oWarrant->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
