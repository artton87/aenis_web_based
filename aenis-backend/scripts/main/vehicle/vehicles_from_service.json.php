<?php
user_auth_check();
if('search' == $_POST['mode'])
{
    $search = array();

    if(!empty($_POST['vin']))
        $search['vin'] = $_POST['vin'];

    if(!empty($_POST['number']))
        $search['vehicle_number'] = $_POST['number'];

    $items = array();
    $oItems = new Transaction_Relationship_Objects();
    $oDocuments = new Documents();

    $result = $oItems->getObjects(
        $search,
        array('vin'=>'vin', 'vehicle_number'=>'vehicle_number','data'=>'object_data')
    );

    while($row = $oItems->db_fetch_array($result))
    {
        $data = unserialize($row['object_data']);
        $items[] = array(
            'id' => $row['id'],
            'object_id' => $row['object_id'],
            'vin' => $row['vin'],
            'number'=> $data['vehicle_number'],
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
}
else
{
    $number = $_POST['number'];
    $vin = $_POST['vin'];

    $matches = array();

    $pattern1 = '/^(\d{2}) *\-?([a-z]{2}) *\-?(\d{3})$/i';
    $pattern2 = '/^(\d{3}) *\-?([a-z]{2}) *\-?(\d{2})$/i';
    if(1 === preg_match($pattern1, $number, $matches))
    {
        $pre = $matches[1];
        $code = $matches[2];
        $post = $matches[3];
    }
    elseif(1 === preg_match($pattern2, $number, $matches))
    {
        $pre = $matches[1];
        $code = $matches[2];
        $post = $matches[3];
    }
    else
    {
        Ext::sendResponse(true, array(
            'data' => array()
        ));
        exit;
    }

    $items = array();
    $oItems = new Objects();
    $vehicle = $oItems->getTransportDetails($pre, $code, $post,$vin);
    if(null !== $vehicle)
    {
        $data = $vehicle['response']['vehicle'];

        $owner = $vehicle['response']['vehicle']['owners']['owner'];
        $items[] = array(
            'body_number'=> $data['type'],
            'body_type'=> $data['body-type'],
            'brand'=> $data['type'],
            'chassis_number'=> $data['chassis-num'],
            'color'=> $data['color-desc'],
            'engine_number'=> $data['engine-num'],
            'engine_power'=> $data['engine-power'],
            'model'=> $data['model-desc'],
            'model_year'=> $data['released'],
            'number'=> $data['number'],
            'type' => $data['vehicle-type'],
            'vin' => $data['vin'],
            'owner' => (!empty($owner['first-name']) && !empty($owner['last-name'])) ? $owner['first-name'].' '.$owner['last-name'] : $owner['first-name']
        );
    }
}

Ext::sendResponse(true, array(
    'data' => $items
));




