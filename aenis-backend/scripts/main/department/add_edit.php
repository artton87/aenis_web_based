<?php
user_auth_check();
	
$data = $_POST['data'];
$data = App_Json::decode($data);

$update_array = array(
	'title' => $data->title,
	'parent_id' => $data->parent_id,
	'num' => $data->num,
	'code' => $data->code,
	'phone' => $data->phone,
	'fax' => $data->fax,
	'email' => $data->email,
	'dep_type_id' => $data->type_id,
	'notarial_office_id' => $data->notarial_office_id
);

$o = null;
try {
	$id = $data->id;
	if(empty($id))
	{
		if(Acl()->denied('department.add'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ստորաբաժանման ավելացման համար:');

		$o = new Departments();
		$id = $o->addDepartment($update_array);
	}
	else
	{
		if(Acl()->denied('department.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ստորաբաժանման խմբագրման համար:');

		$o = new Departments();
		$o->updateDepartment($id, $update_array);
	}
	$o->db_commit();
	Ext::sendResponse(true, array());
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
