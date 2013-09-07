<?php
user_auth_check();

$oWarrants = null;
try {
	$id = $_POST['id'];

	$data = App_Json::decode($_POST['data'], true);
	$data = App_Array::pick($data,
		'notary_id',
		'tr_type_id',
		'parties',
		'objects',
		'relationship_documents',
		'properties',
        'party_rights',
        'subject_relations'
	);


	//content is also property, add it to transaction property list manually
	$data['properties'][] = array(
		'id' => 'template_content',
		'tr_id' => 0,
		'value' => $_POST['content']
	);

    //Logger::out($data);

	if(empty($id))
    {
		if(Acl()->denied('warrant.add'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ լիազորագրի ավելացման համար:');

        $oWarrants = new Warrants();
		$id = $oWarrants->addWarrant($data);
    }
    else
    {
		if(Acl()->denied('warrant.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ լիազորագրի խմբագրման համար:');

        $oWarrants = new Warrants();
		$id = $oWarrants->updateWarrant($id, $data);
    }

    $oWarrants->db_commit();

    Ext::sendResponse(true, array(
        'data' => array('id'=>$id)
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oWarrants) $oWarrants->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
