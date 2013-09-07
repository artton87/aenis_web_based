<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	if(empty($data['country_id']))
	{
		$oCountries = new Countries();
		$data['country_id'] = $oCountries->getDefaultCountry()->id;
	}

	$update_array = array(
		'country_id' => $data['country_id'],
		'code' => $data['code'],
		'content' => $data['contentData']
	);

	if(empty($id))
    {
        if(Acl()->denied('region.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ մարզի ավելացման համար:');

		$o = new Country_Regions();
        $id = $o->addRegion($update_array);
    }
    else
    {
		if(Acl()->denied('region.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ մարզի խմբագրման համար:');
        
        $o = new Country_Regions();
		$o->updateRegion($id, $update_array);
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
