<?php
user_auth_check();

$o = null;
try {
    $data = $_POST['data'];
    $data = App_Json::decode($data, true);
	$id = $data['id'];

    $update_array = App_Array::pick($data, array(
        'tr_type_id',
        'inheritor_type_id',
        'parcel_purpose_type_id',
		'building_type_id',
		'state_fee_coefficient'
    ));

    if(empty($id))
    {
        if(Acl()->denied('rates.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար դրույքաչափի ավելացման համար:');

        $o = new Rates();
        $id = $o->addRate($update_array);
    }
    else
    {

        if(Acl()->denied('rates.edit'))
            throw new App_Exception_Permission('Դուք չունեք բավարար դրույքաչափի խմբագրման համար:');

        $o = new Rates();

        $o->updateRate($id, $update_array);
    }
    $o->db_commit();
    Ext::sendResponse(true, array());
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$o) $o->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
