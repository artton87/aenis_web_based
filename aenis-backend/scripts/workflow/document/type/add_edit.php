<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data, true);

	$id = $data['id'];

    $update_array = App_Array::pick($data, array(
        'parent_id',
        'tr_type_id',
        'label',
        'hidden',
        'order_in_list',
        'is_used_in_portal',
        'doc_type_code',
        'contentData' => 'content'
    ));

    //Logger::out($update_array);


	if(empty($id))
    {
		if(Acl()->denied('document.type.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ փաստաթղթի տեսակի ավելացման համար:');

		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users cannot add some fields
		{
			unset($update_array['doc_type_code']);
		}

        $o = new Document_Types();
        $id = $o->addItem($update_array);
    }
    else
    {
		if(Acl()->denied('document.type.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ փաստաթղթի տեսակի խմբագրման համար:');

		$o = new Document_Types();
		if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
		{
			$new_doc_type_code = $update_array['doc_type_code'];
			if(!empty($new_doc_type_code))
			{
                $oLanguages = new Languages();
                $lang_id = $oLanguages->getDefaultLanguage()->id;

				$result = $o->getItems(array('id'=>$id), array($lang_id));
				if($row = $o->db_fetch_array($result))
				{
					if($row['doc_type_code'] != $new_doc_type_code) //attempt to change doc_type_code
					{
						throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ փաստաթղթի տեսակի կոդի խմբագրման համար');
					}
				}
			}
		}
		$o->updateItem($id, $update_array);
    }

    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id, 'doc_type_code' => $update_array['doc_type_code'])
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
