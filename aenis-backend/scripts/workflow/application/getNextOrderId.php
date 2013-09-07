<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oPayment_logs = new Payment_Logs();
    $params = App_Json::decode($_POST['params'], true);
    $terminal_id = $params['terminal_id'];
    $data_ser = $params['data_ser'];
    $payment_tr_id = $params['payment_tr_id'];
    $orderId = $oPayment_logs->insert_log($data_ser, $terminal_id,$payment_tr_id);
    $oPayment_logs->db_commit();
    Ext::sendResponse(true, array(
        'data' => $orderId,
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oPayment_logs) $oPayment_logs->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}