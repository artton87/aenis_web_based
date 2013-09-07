<?php
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type'); 
$portal = $_POST['portal'];

if($portal != 1)
{
    user_auth_check(true);
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $params = App_Json::decode($_POST['data'], true);
}
else
{
    $params = $_POST['data'];

}

$oMsg = null;

try
{
    $oMsg = new Application_Messages();  
   
    $messages = $oMsg->addMessage($params);

    Ext::sendResponse(true, array(
        'data' => true,
    ));
    $oMsg->db_commit();
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oMsg) $oMsg->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}