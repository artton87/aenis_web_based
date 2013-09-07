<?php
user_auth_check();

$o = null;
try{
	if(Acl()->denied('template.variable.delete'))
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ փոփոխականի հեռացման համար:');

	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$o = new Template_Variables();
	if(!App_Registry::get('temp_sn')->user_is_root) //non-root users should not change some fields
	{
		$result = $o->getItems(array('variable_id'=>$id));
		if($row = $o->db_fetch_array($result))
		{
			if(1 == $row['is_dynamic']) //attempt to delete dynamic variable
			{
				throw new App_Db_Exception_Validate('Դուք չունեք բավարար իրավունքներ դինամիկ փոփոխականի հեռացման համար');
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
