<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oTransaction_Types = new Transaction_Types();
    $params = App_Json::decode($_POST['params'], true);
    $template_id = $oTransaction_Types->getTemplateIdPortal($params['app_type']);


    Ext::sendResponse(true, array(
        'data' => array('template_id' => $template_id ),
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oTransaction_Types) $oTransaction_Types->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}