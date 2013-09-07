<?php
user_auth_check(true);

if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
$oPayment_logs = new Payment_Logs();
$params = App_Json::decode($_POST['params'], true);
$order_id = $params['order_id'];
$log = $oPayment_logs->getLog($order_id);
Ext::sendResponse(true, array(
        'data' => $log,
));

