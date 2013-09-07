<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	/*$update_array = array(
		'label' => $data->label,
		'party_type_code' => $data->party_type_code
	);*/
	$update_array = App_Array::pick($data, array(
		'party_type_code',
		'contentData' => 'content'
	));

	if(empty($id))
    {
        if(Acl()->denied('party.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ կողմի տեսակի ավելացման համար:');

		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users cannot add some fields
		{
			unset($update_array['party_type_code']);
		}

        $o = new Party_Types();
        $id = $o->addType($update_array);
    }
    else
    {
		if(Acl()->denied('party.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ կողմի տեսակի խմբագրման համար:');
        
        $o = new Party_Types();
		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
		{
			$new_party_type_code = $update_array['party_type_code'];
			if(!empty($new_party_type_code))
			{
				$result = $o->getTypes(array('id'=>$id));
				if($row = $o->db_fetch_array($result))
				{
					if($row['party_type_code'] != $new_party_type_code) //attempt to change party_type_code
					{
						throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ կողմի տեսակի կոդի խմբագրման համար');
					}
				}
			}
		}
        $o->updateType($id, $update_array);
    }
    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id, 'party_type_code' => $update_array['party_type_code'])
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
