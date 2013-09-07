<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oTr = new Transactions();
    $params = App_Json::decode($_POST['params'], true);

    $tr = $oTr->getTransactionByAppId($params['app_id']);


    Ext::sendResponse(true, array(
        'data' => array('tr_id' => $tr['id'] ),
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oTr) $oTr->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}