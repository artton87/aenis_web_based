<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'doc_type_id' => $data->doc_type_id,
		'title' => $data->title,
		'content' => $data->content
	);

	if(!$data->is_common_template)
	{
		$update_array['definer_user_id'] = App_Registry::get('temp_sn')->user_id;
	}

	if(empty($id))
    {
		if(Acl()->denied('template.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ձևի ավելացման համար:');

		if($data->is_common_template && Acl()->denied('template.add_common_template'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ բոլորին տեսանելի ձևի ավելացման համար:');

        $o = new Templates();
        $id = $o->addItem($update_array);
    }
    else
    {
		if(Acl()->denied('template.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ձևի խմբագրման համար:');

		if($data->is_common_template && Acl()->denied('template.add_common_template'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ բոլորին տեսանելի ձևի խմբագրման համար:');

		$o = new Templates();
		$o->updateItem($id, $update_array);
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
