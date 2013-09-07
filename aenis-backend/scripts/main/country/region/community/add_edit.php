<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	$update_array = array(
		'region_id' => $data['region_id'],
		'is_urban' => $data['is_urban'],
		'content' => $data['contentData']
	);

	if(empty($id))
    {
        if(Acl()->denied('community.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ համայնքի ավելացման համար:');

		$o = new Country_Region_Communities();
        $id = $o->addCommunity($update_array);
    }
    else
    {
		if(Acl()->denied('community.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ համայնքի խմբագրման համար:');
        
        $o = new Country_Region_Communities();
		$o->updateCommunity($id, $update_array);
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
