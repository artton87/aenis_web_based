<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');
    $oPayment_logs = new Payment_Logs();
    $oPayments = new Payments();
    $params = App_Json::decode($_POST['params'], true);
    $details = $params['details'];
    $payment_data = $params['payment_data'];
    $oPayment_logs->insert_response($payment_data['order_id'], $details);
    $oPayments->addPaymentOrderId($payment_data);
    $oPayment_logs->db_commit();
    Ext::sendResponse(true, array(
        'data' => '',
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oPayment_logs) $oPayment_logs->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}