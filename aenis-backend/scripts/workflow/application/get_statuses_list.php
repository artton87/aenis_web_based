<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oStatuses = new Transaction_Statuses();
    $params = App_Json::decode($_POST['params'], true);
    $statusesResult = $oStatuses->getStatuses(array(1,3));
    $statuses = array();
    while($statusesList = $oStatuses->db_fetch_array($statusesResult))
    {
        $statuses[] = $statusesList;
    }



    Ext::sendResponse(true, array(
        'data' => array('statusesList' => $statuses ),
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oStatuses) $oStatuses->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}