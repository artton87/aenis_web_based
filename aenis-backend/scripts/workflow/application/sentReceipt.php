<?php
user_auth_check(true);
try
{
    if(Acl()->denied('application.get'))
        throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի դիմում(ներ)ի տվյալները ստանալու համար:');

    $oPayment_logs = new Payment_Logs();
    $oCustomers = new Customers();
    $oApplications = new Applications();
    $params = App_Json::decode($_POST['params'], true);
    $order_id = $params['order_id'];
    $PAYMENT_CONSTANTS = $params['PAYMENT_CONSTANTS'];
    $log = $oPayment_logs->getLog($order_id);
    $log_request_data = (array) unserialize($log['request_data']);
    $log_response_data = (array) unserialize($log['response_data']);
    $app_id = $log_request_data['app_id'];
    $application = $oApplications->getApp($app_id);
    $customer = $oCustomers->getCustomer($application['customer_id']);
    $receipt_path = $oApplications->sentReceipt($log_response_data,$log_request_data,$customer,$PAYMENT_CONSTANTS);
    
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

?>