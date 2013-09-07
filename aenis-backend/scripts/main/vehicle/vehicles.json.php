<?php
user_auth_check();

$search = array();


if(!empty($_POST['id']))
    $search['object_id'] = $_POST['id'];

$items = array();
$oItems = new Transaction_Relationship_Objects();
$oDocuments = new Documents();

$result = $oItems->getObjects(
    $search,
    array('id'=>'vin', 'number'=>'vehicle_number','data'=>'object_data')
);

while($row = $oItems->db_fetch_array($result))
{
    $data = unserialize($row['object_data']);
    $items[] = array(
        'id' => $row['id'],
        'object_id' => $row['object_id'],
        'vin' => $row['vin'],
        'number'=> $data['number'],
        'body_number'=> $data['body_number'],
        'body_type'=> $data['body_type'],
        'brand'=> $data['type'],
        'chassis_number'=> $data['chassis_number'],
        'color'=> $data['color'],
        'engine_number'=> $data['engine_number'],
        'engine_power'=> $data['engine_power'],
        'model'=> $data['model'],
        'model_year'=> $data['model_year'],
        'type' => $data['type'],
        'owner' =>  $data['owner']
    );
}

Ext::sendResponse(true, array(
    'data' => $items
));