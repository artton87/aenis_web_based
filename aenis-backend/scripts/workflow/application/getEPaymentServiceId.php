<?php
user_auth_check(true);

if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
$oPayment_Services = new Payment_Services();
$params = App_Json::decode($_POST['params'], true);
$tr_type_id = $params['app_type_id'];
$payment_Service = $oPayment_Services->get_payment_services($tr_type_id);

Ext::sendResponse(true, array(
        'data' => $payment_Service,
));

