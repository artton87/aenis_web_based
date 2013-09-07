<?php
user_auth_check(true);

if(Acl()->denied('application.get'))
    throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');

$oApperances = new Application_Appearance();

$params = App_Json::decode($_POST['params'], true);
$app_type = $params['app_type'];
$lang_id = $params['lang_id'];
$data = $oApperances->getAppearances($app_type,$lang_id);
Ext::sendResponse(true, array(
    'data' => $data
));
