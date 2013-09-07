<?php
user_auth_check();

//$mode = $_POST['mode'];

$oTransactionStatuses = new Transaction_Statuses();
$items = array();
$items[] = array(
    'id' => 0,
    'title' => 'Բոլորը'
);
$result = $oTransactionStatuses->getStatuses(/*$mode*/);

while($row = $oTransactionStatuses->db_fetch_array($result))
{
    $items[] = $row;
}

Ext::sendResponse(true, array(
    'data' => $items
));

