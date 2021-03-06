<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'label' => $data->label
	);

	if(empty($id))
    {
        if(Acl()->denied('sub_nao.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ենթա-ՆԱՕ տեսակի ավելացման համար:');

		$o = new Nao_SubTypes();
        $id = $o->addType($update_array);
    }
    else
    {
		if(Acl()->denied('sub_nao.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ենթա-ՆԱՕ տեսակի խմբագրման համար:');
        
        $o = new Nao_SubTypes();
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
