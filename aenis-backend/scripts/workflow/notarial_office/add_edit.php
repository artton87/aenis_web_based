<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	$update_array = array(
		'latitude' => $data['latitude'],
		'longitude' => $data['longitude'],
		'postal_index' => $data['postal_index'],
		'community_id' => $data['community_id'],
		'content' => $data['contentData']
	);

	if(empty($id))
    {
        if(Acl()->denied('notarial_office.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ նոտարական գրասենյակի ավելացման համար:');

        $o = new NotarialOffices();
        $id = $o->addOffice($update_array);
    }
    else
    {
		if(Acl()->denied('notarial_office.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ նոտարական գրասենյակի խմբագրման համար:');
        
        $o = new NotarialOffices();
		$o->updateOffice($id, $update_array);
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
