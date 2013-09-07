<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'name' => $data->name,
		'abbreviation' => $data->abbreviation
	);

	if(empty($id))
    {
        if(Acl()->denied('contact.juridical.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ կազմակերպա-իրավական տեսակի ավելացման համար:');

		$o = new Contact_Juridical_Types();
        $id = $o->addType($update_array);
    }
    else
    {
		if(Acl()->denied('contact.juridical.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ կազմակերպա-իրավական տեսակի խմբագրման համար:');
        
        $o = new Contact_Juridical_Types();
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
