<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oTransaction = new Transactions();
    $params = App_Json::decode($_POST['params'], true);
    $label = $oTransaction->getTr_type($params['tr_id'], $prams['lang_id']);

    Ext::sendResponse(true, array(
        'data' => array('label' => $label),
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oApplications) $oApplications->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}