<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'title' => $data->title,
		'permissions' => $data->permissions
	);

	if(empty($id))
    {
		if(Acl()->denied('role.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ իրավունքների խմբի ավելացման համար:');

		$o = new Roles();
        $id = $o->addRole($update_array);
    }
    else
    {
		if(Acl()->denied('role.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ իրավունքների խմբի խմբագրման համար:');
        
        $o = new Roles();
        $o->updateRole($id, $update_array);
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
