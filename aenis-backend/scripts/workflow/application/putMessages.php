<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oMsg = new Application_Messages();
    $params = App_Json::decode($_POST['params'], true);   
    $messages = $oMsg->addMessage($params);

    Ext::sendResponse(true, array(
        'data' => TRUE,
    ));
    $oMsg->db_commit();
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oMsg) $oMsg->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}