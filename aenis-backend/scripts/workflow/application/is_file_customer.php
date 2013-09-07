<?php
Logger::logDebugInformation('testing');
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oApplications = new Applications();
    $params = App_Json::decode($_POST['params'], true);
    $customer_id = $oApplications->is_file_customer($params['file_id']);
     
    Ext::sendResponse(true, array(
        'data' => array('customer_id' => $customer_id),
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oApplications) $oApplications->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}