<?php
user_auth_check(true);

if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
$oApplications = new Applications();
$params = App_Json::decode($_POST['params'], true);
$app_id = $params['app_id'];
$app_data = $oApplications->getApplication_data($app_id);
$app_data['app_type_id'] = $app_data['tr_type_id'];
Ext::sendResponse(true, array(
        'data' => $app_data,
));

