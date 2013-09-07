<?php
user_auth_check();

$start = (!empty($_POST['start'])) ? $_POST['start'] : 0;
$limit = (!empty($_POST['limit'])) ? $_POST['limit'] : 0;
$init = (!empty($_POST['init'])) ? $_POST['init'] : 0;

$oApplication= new Applications();

if(!empty($_POST['tr_status_id']))
    $search['tr_status_id'] = $_POST['tr_status_id'];

if(!empty($_POST['lu_date']))
    $search['lu_date'] = $_POST['lu_date'];

if(!empty($_POST['start_date']) && !empty($_POST['end_date']))
{
    $search['start_date'] = $_POST['start_date'];
    $search['end_date'] = $_POST['end_date'];
}

//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'search_onlineApplications_'.$_POST['view_uid'];

if(1 == $_POST['init']) //if init=1 found in request, reset session
{
    //unset search parameters
    $oSession->unsetCollection($session_collection_key);
}

$result = $oApplication->getOnlineApplications($search, $start, $limit);
$applications = array();

while($row = $oApplication->db_fetch_array($result))
{

    $applications[] = array(
          'id' => $row['id'],
          'app_id' => $row['app_id'],
          'notary_id' => $row['notary_id'],
          'customer_id' => $row['customer_id'],
          'application_type' => $row['label'],
          'customer' => $row['customer'],
          'status' => $row['tr_status_title'],
          'tr_status_code' => $row['tr_status_code'],
          'tr_status_id' => $row['tr_status_id'],
          'input_date' => $row['input_date'],
          'ui_type' => $row['ui_type']
    );
}

if($init == 1)
{
    $total = $oApplication->getOnlineApplications($search, 0, 0, true);
    $oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
}
else
{
    $total = $oSession->getItem('total', $session_collection_key);
}
//Logger::out($applications);
Ext::sendResponse(true, array(
    'data' => $applications,
    'total' => $total
));