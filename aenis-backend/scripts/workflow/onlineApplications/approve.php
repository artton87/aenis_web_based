<?php
user_auth_check();

$id = $_POST['id'];

$update_array = App_Array::pick($_POST,
    'application_date',
    'message',
    'application_time',
    'approve_application'
);

$data = App_Json::decode($_POST['data'], true);

$update_array += App_Array::pick($data,
    array(
        'app_id',
        'tr_type_id',
        'notary_id',
        'parties',
        'objects',
        'relationship_documents',
    )
);

$oApplication = null;

try
{
    $oApplication = new Applications();
    $oApplication->approveApplication($id, $update_array);
    $oApplication->db_commit();
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oApplication) $oApplication->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
