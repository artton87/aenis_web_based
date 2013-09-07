<?php
user_auth_check();

$o = null;
try{
	if(Acl()->denied('user.resources.update'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ օգտվողի անհատական իրավունքների փոփոխման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$user_id = $data->user_id;
	$resources = $data->permissions;

	$o = new User_Resources();
	foreach($resources as $info)
	{
		if($info->allowed)
		{
			$o->allow($user_id, $info->resource_id);
		}
		else
		{
			$o->deny($user_id, $info->resource_id);
		}
	}

	$o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
