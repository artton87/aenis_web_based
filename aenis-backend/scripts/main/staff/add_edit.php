<?php
user_auth_check();
	
$data = $_POST['data'];
$data = App_Json::decode($data, true);

$update_array = App_Array::pick($data, array(
	'title' => 'member_name',
	'parent_id' => 'member_parent_id',
	'staff_order' => 'member_num',
	'dep_id',
	'roles'
));

$o = null;
try {
	$id = $data['id'];
	if(empty($id))
	{
		if(Acl()->denied('staff.add'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ պաշտոնի ավելացման համար:');

		$o = new Staff();
		$o->addMember($update_array);
	}
	else
	{
		if(Acl()->denied('staff.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ պաշտոնի խմբագրման համար:');

		$o = new Staff();
		$o->updateMember($id, $update_array);
	}
	$o->db_commit();
	Ext::sendResponse(true, array());

}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
