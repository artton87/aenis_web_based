<?php
user_auth_check();

$oWills = null;
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
		if(Acl()->denied('will.add'))
			throw new App_Exception_Permission('???? ?????? ??????? ??????????? ????? ????????? ?????:');

		$oWills = new Wills();
		$id = $oWills->addWill($data);
    }
    else
    {
		if(Acl()->denied('will.edit'))
			throw new App_Exception_Permission('???? ?????? ??????? ??????????? ????? ????????? ?????:');

        $oWills = new Wills();
		$id = $oWills->updateWill($id, $data);
    }

    $oWills->db_commit();

    Ext::sendResponse(true, array(
        'data' => array('id'=>$id)
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oWills) $oWills->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
