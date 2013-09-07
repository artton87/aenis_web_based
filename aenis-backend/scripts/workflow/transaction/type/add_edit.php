<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);
	$id = $data['id'];

	$update_array = App_Array::pick($data, array(
		'parent_id',
		'hidden',
		'ui_type',
		'order_in_list',
		'is_used_in_portal',
		'form_template',
		'service_fee_coefficient_min',
		'service_fee_coefficient_max',
		'contentData' => 'content'
	));

	if(empty($id))
    {
		if(Acl()->denied('transaction.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի տեսակի ավելացման համար:');

		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users cannot add some fields
		{
			unset($update_array['form_template']);
		}

        $o = new Transaction_Types();
        $id = $o->addItem($update_array);
    }
    else
    {
		if(Acl()->denied('transaction.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ գործարքի տեսակի խմբագրման համար:');

		$o = new Transaction_Types();
		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
		{
			$new_form_template = $update_array['form_template'];
			if(!empty($new_form_template))
			{
				$oLanguages = new Languages();
				$lang_id = $oLanguages->getDefaultLanguage()->id;

				$result = $o->getItems(array('id'=>$id), array($lang_id));
				if($row = $o->db_fetch_array($result))
				{
					if($row['form_template'] != $new_form_template) //attempt to change form_template
					{
						throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ գործարքի տեսակի կոդի խմբագրման համար');
					}
				}
			}
		}
		$o->updateItem($id, $update_array);
    }

    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id, 'form_template' => $update_array['form_template'])
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
