<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = App_Array::pick($data,
		'doc_type_id',
		'is_dynamic',
		'title',
		'code',
		'content'
	);

	if(empty($id))
    {
		if(Acl()->denied('template.variable.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ փոփոխականի ավելացման համար:');

		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users cannot add some fields
		{
			$update_array['is_dynamic'] = 0;
		}

        $o = new Template_Variables();
        $id = $o->addItem($update_array);
    }
    else
    {
		if(Acl()->denied('template.variable.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ փոփոխականի խմբագրման համար:');

		$o = new Template_Variables();
		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
		{
			$new_code = $update_array['code'];
			if(!empty($new_code))
			{
				$result = $o->getItems(array('variable_id'=>$id));
				if($row = $o->db_fetch_array($result))
				{
					if($row['code'] != $new_code && 1==$row['is_dynamic']) //attempt to change code of dynamic variable
					{
						throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ դինամիկ փոփոխականի կոդի խմբագրման համար');
					}
					if($update_array['is_dynamic'] != $row['is_dynamic']) //attempt to make dynamic variable static
					{
						throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ դինամիկ փոփոխականը ստատիկ (կամ հակառակը) դարձնելու համար');
					}
				}
			}
		}
		$o->updateItem($id, $update_array);
    }

    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' => array(
			'id' => $id,
			'is_dynamic' => $update_array['is_dynamic'],
			'is_data_required' => $update_array['is_data_required']
		)
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
