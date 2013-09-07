<?php
user_auth_check();

$o = null;
try{
	if(Acl()->denied('object.type.delete'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ օբյեկտի տեսակի հեռացման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$o = new Object_Types();
	if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
	{
		$result = $o->getItems(array('id'=>$id));
		if($row = $o->db_fetch_array($result))
		{
			if(!empty($row['code'])) //attempt to delete object type with code set
			{
				throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ տվյալ օբյեկտի տեսակի հեռացման համար');
			}
		}
	}
	$o->deleteItem($id);
	$o->db_commit();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
