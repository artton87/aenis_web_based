<?php

user_auth_check();

$oCases = null;

$oPages = new Document_Pages();
$results = $oPages->getPageFormats();
//var_dump($results); exit;
$items = array();
while($row = $oPages->db_fetch_array($results)){
    $items[] = array(
        'id' => $row['id'],
        'title' => $row['title'].' ('.$row['page_size'].')',
        'page_size' => $row['page_size']
    );
}
Ext::sendResponse(true, array(
    'data' => $items
));
