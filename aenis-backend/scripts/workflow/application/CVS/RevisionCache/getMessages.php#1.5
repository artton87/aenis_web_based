<?php
user_auth_check(true);

if(Acl()->denied('application.get'))
    throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');

$oMsg = new Application_Messages();

$params = App_Json::decode($_POST['params'], true);
$messages = array();

$result = $oMsg->getMessages($params['id']);
while($row = $oMsg->db_fetch_array($result))
{
    $messages[] = array(
        'id' => $row['id'],
        'app_id' => $row['app_id'],
        'message_date' => $row['message_date'],
        'customer_id' => $row['customer_id'],
        'notary_id' => $row['notary_id'],
        'message' => $row['message'],
        'first_name' => $row['first_name'],
        'customer_name' => $row['customer_name'],
        'customer_last_name' => $row['customer_last_name']
    );
}

Ext::sendResponse(true, array(
    'data' => array('messages' => $messages)
));
