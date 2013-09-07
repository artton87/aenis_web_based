<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	$update_array = App_Array::pick($data,
		'tr_property_type_id',
		'label'
	);

	if(empty($id))
    {
		if(Acl()->denied('transaction.property.type.value.add'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի ատրիբուտի արժեքի ավելացման համար:');

        $o = new Transaction_Property_Type_Values();
        $id = $o->addValue($update_array);
    }
    else
    {
		if(Acl()->denied('transaction.property.type.value.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի ատրիբուտի արժեքի խմբագրման համար:');

		$o = new Transaction_Property_Type_Values();
		$o->updateValue($id, $update_array);
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
