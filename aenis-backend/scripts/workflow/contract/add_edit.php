<?php
user_auth_check();

$oContracts = null;
try {
	$id = $_POST['id'];

	$data = App_Json::decode($_POST['data'], true);
	$data = App_Array::pick($data,
		'notary_id',
		'tr_type_id',
		'parties',
		'objects',
		'relationship_documents',
		'properties'
	);

	//content is also property, add it to transaction property list manually
	$data['properties'][] = array(
		'id' => 'template_content',
		'tr_id' => 0,
		'value' => $_POST['content']
	);

	if(empty($id))
    {
		if(Acl()->denied('contract.add'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ պայմանագրի ավելացման համար:');

		$oContracts = new Contracts();
		$id = $oContracts->addContract($data);
    }
    else
    {
		if(Acl()->denied('contract.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ պայմանագրի խմբագրման համար:');

		$oContracts = new Contracts();
		$id = $oContracts->updateContract($id, $data);
    }

	$oContracts->db_commit();

    Ext::sendResponse(true, array(
        'data' => array('id'=>$id)
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oContracts) $oContracts->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
