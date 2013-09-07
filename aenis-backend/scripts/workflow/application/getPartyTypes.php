<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oParty_Types = new Party_Types();
    $params = App_Json::decode($_POST['params'], true);
    $party_Types = $oParty_Types->getTypePortal($params['app_type'],array($params['lang_id']));


    Ext::sendResponse(true, array(
        'data' => array('partyTypesList' => $party_Types ),
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oParty_Types) $oParty_Types->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}