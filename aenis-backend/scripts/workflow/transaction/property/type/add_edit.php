<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	$update_array = App_Array::pick($data,
		'label',
		'code',
		'type'
	);

	if(empty($id))
    {
		if(Acl()->denied('transaction.property.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի ատրիբուտի ավելացման համար:');

		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users cannot add some fields
		{
			unset($update_array['code']);
		}

        $o = new Transaction_Property_Types();
        $id = $o->addType($update_array);

		$typeValuesData = $data['typeValuesData'];
		if(!empty($typeValuesData))
		{
			$oValues = new Transaction_Property_Type_Values();
			foreach($typeValuesData as $type_value_info)
			{
				$v = array(
					'tr_property_type_id' => $id,
					'label' => $type_value_info['label'],
				);
				$oValues->addValue($v);
			}
		}
    }
    else
    {
		if(Acl()->denied('transaction.property.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի ատրիբուտի խմբագրման համար:');

		$o = new Transaction_Property_Types();
		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
		{
			$new_code = $update_array['code'];
			if(!empty($new_code))
			{
				$result = $o->getTypes(array('id'=>$id), App_Registry::get('temp_sn')->user_is_root);
				if($row = $o->db_fetch_array($result))
				{
					if($row['code'] != $new_code) //attempt to change code
					{
						throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ գործարքի ատրիբուտի կոդի խմբագրման համար');
					}
				}
			}
		}
        $o->updateType($id, $update_array);
    }
    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id, 'code' => $update_array['code'])
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
