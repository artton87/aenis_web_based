<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'label' => $data->label
	);

	if(empty($id))
    {
        if(Acl()->denied('building.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ շինության տեսակի ավելացման համար:');

		$o = new Building_Types();
        $id = $o->addType($update_array);
    }
    else
    {
		if(Acl()->denied('building.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ շինության տեսակի խմբագրման համար:');
        
        $o = new Building_Types();
		$o->updateType($id, $update_array);
    }
    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id)
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
