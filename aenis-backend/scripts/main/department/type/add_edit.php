<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'title' => $data->title
	);

	if(empty($id))
    {
		if(Acl()->denied('department.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ստորաբաժանման տեսակի ավելացման համար:');
        
        $o = new Department_Types();
        $id = $o->addType($update_array);
    }
    else
    {
		if(Acl()->denied('department.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ստորաբաժանման տեսակի խմբագրման համար:');
        
        $o = new Department_Types();
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
