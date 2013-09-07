<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'title' => $data->title,
		'code' => $data->code,
		'type' => $data->type,
		'is_root_resource' => $data->is_root_resource
	);

	if(empty($id))
    {
		if(Acl()->denied('resource.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ռեսուրսի ավելացման համար:');

        $o = new Resources();
        $id = $o->addResource($update_array);
    }
    else
    {
		if(Acl()->denied('resource.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ռեսուրսի խմբագրման համար:');

        $o = new Resources();
        $o->updateResource($id, $update_array);
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
