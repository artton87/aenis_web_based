<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	$update_array = App_Array::pick($data, array(
		'username',
		'password',
		'email',
		'fax_number',
		'phone',
		'phone_mobile',
		'passport',
		'ssn',
		'notary_code',
		'is_ws_consumer',
		'is_notary',
		'contentData' => 'content'
	));

	if(empty($id))
    {
    	if(Acl()->denied('user.add'))
				throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ օգտվողի ավելացման համար:');

		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users cannot add some fields
		{
			$update_array['is_ws_consumer'] = 0;
		}

        $o = new Users();
        $id = $o->addUser($update_array);
    }
    else
    {
		if(Acl()->denied('user.edit'))
				throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ օգտվողի խմբագրման համար:');
        
		$o = new Users();
		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
		{
			$new_is_ws_consumer = $update_array['is_ws_consumer'];
			$result = $o->getUsers(array('user_id'=>$id));
			if($row = $o->db_fetch_array($result))
			{
				if($row['is_ws_consumer'] != $new_is_ws_consumer) //attempt to change is_ws_consumer flag
				{
					throw new App_Db_Exception_Validate(
						'Դուք չունեք բավարար իրավունքներ օգտվողին թույլատրել/չթույլատրել օգտվել համակարգի վեբ ծառայություններից:'
					);
				}
			}
		}
		$o->updateUser($id, $update_array);
    }
    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id, 'is_ws_consumer' => $update_array['is_ws_consumer'])
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
