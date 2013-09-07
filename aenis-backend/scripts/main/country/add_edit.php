<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'name' => $data->name,
		'code' => $data->code
	);

	if(empty($id))
    {
        if(Acl()->denied('country.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ երկրի ավելացման համար:');

		$o = new Countries();
        $id = $o->addCountry($update_array);
    }
    else
    {
		if(Acl()->denied('country.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ երկրի խմբագրման համար:');
        
        $o = new Countries();
		$o->updateCountry($id, $update_array);
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
