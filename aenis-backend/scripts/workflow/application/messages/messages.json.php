<?php
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type'); 
$start = (!empty($_POST['start'])) ? $_POST['start'] : 0;
$limit = (!empty($_POST['limit'])) ? $_POST['limit'] : 0;
$init = (!empty($_POST['init'])) ? $_POST['init'] : 0;

$portal = $_POST['portal'];

$search = array();

if(1 != $portal)
{
    user_auth_check(true);
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $params = App_Json::decode($_POST['params'], true);

    if(!empty($_POST['app_id']))
        $search['app_id'] = $_POST['app_id'];
    else
        $search['app_id'] = $params['app_id'];

    if(!empty($_POST['message_id']))
    {
        $search['message_id'] = $_POST['message_id'];
    }

}
else
{
    $search['app_id'] = $_POST['params']['app_id'];//for ajax request handling
}
//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'application_messages_'.$_POST['view_uid'];

$oMsg = new Application_Messages();

$messages = array();


$result = $oMsg->getMessages($search, $start, $limit);
while($row = $oMsg->db_fetch_array($result))
{
    $messages[] = array(
        'id' => $row['id'],
        'app_id' => $row['app_id'],
        'message_date' => $row['message_date'],
        'customer_id' => $row['customer_id'],
        'message' => $row['message'],
        'author' => $row['notary'].''.$row['customer_name'].' '.$row['customer_last_name'],
        'customer' => $row['customer_name'].' '.$row['customer_last_name'],
        'notary' => $row['notary'],

    );
}

//if(1 == $init)
{
    $total = $oMsg->getMessages($search, $start, $limit, true);
    $oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
}
//else
{
    //$total = $oSession->getItem('total', $session_collection_key);
}
//Logger::logDebugInformation($messages);
Ext::sendResponse(true, array(
    'data' => $messages,
    'total' => $total
));
