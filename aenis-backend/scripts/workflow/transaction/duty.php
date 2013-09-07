<?php

$data = App_Array::pick($_POST, 'transaction_id');

Logger::out($_POST);

$oTransaction = new Transaction();
$duty = $oTransaction->getDutyValue($data);
$oWarrants->db_commit();
Ext::sendResponse(true,array(
    'data' => $duty
));
