<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	$update_array = App_Array::pick($data, array(
        'label'
    ));

    //Logger::out($update_array);

	if(empty($id))
    {
        if(Acl()->denied('subject.inheritor.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ժառանգության կապի տեսակի ավելացման համար:');

        $o = new Subject_Inheritor_Types();
        $id = $o->addType($update_array);
    }
    else
    {
		if(Acl()->denied('subject.inheritor.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ժառանգության կապի խմբագրման համար:');
        
        $o = new Subject_Inheritor_Types();
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
