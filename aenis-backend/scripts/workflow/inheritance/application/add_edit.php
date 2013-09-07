<?php
user_auth_check();

$oInheritanceApplication = null;

try {
	$id = $_POST['id'];

	$data = App_Json::decode($_POST['data'], true);
	$data = App_Array::pick($data,
		'notary_id',
		'tr_type_id',
		'parties',
		'relationship_documents',
        'opening_notary_id',
        'testatorAddress',
        'death_certificate'
	);

    //content is also property, add it to transaction property list manually
    $data['properties'][] = array(
        'id' => 'template_content',
        'tr_id' => 0,
        'value' => $_POST['content']
    );

	if(empty($id))
    {
		if(Acl()->denied('inheritance.application.add'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ժառանգության դիմումի ավելացման համար:');

        $oInheritanceApplication = new Inheritance_Applications();
		$id = $oInheritanceApplication->addInheritanceApplication($data);
    }
    else
    {
		if(Acl()->denied('inheritance.application.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ժառանգության դիմումի  խմբագրման համար:');

        $oInheritanceApplication = new Inheritance_Applications();
		$id = $oInheritanceApplication->updateInheritanceApplication($id, $data);
    }

    $oInheritanceApplication->db_commit();

    Ext::sendResponse(true, array(
        'data' => array('id'=>$id)
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oInheritanceApplication) $oInheritanceApplication->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
