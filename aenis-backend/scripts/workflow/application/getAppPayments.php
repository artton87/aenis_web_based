<?php
user_auth_check(true);

if(Acl()->denied('application.get'))
    throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');

$oPayments = new Payments();

$params = App_Json::decode($_POST['params'], true);
$app_id = $params['app_id'];
$amounts = $oPayments->getAppPayments($app_id);
Ext::sendResponse(true, array(
    'data' => $amounts
));
