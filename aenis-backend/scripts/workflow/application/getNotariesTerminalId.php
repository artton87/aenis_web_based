<?php
user_auth_check(true);

if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
$oUser_Terminals = new User_Terminals();
$params = App_Json::decode($_POST['params'], true);
$user_id = $params['notaries_id'];
$terminal_id = $oUser_Terminals->get_user_terminal($user_id);
Ext::sendResponse(true, array(
        'data' => $terminal_id['terminal_id'],
));

