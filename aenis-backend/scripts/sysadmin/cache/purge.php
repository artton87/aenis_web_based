<?php
user_auth_check();

$o = null;
try{
	if(!App_Registry::get('temp_sn')->user_is_root)
		throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ cache-ի հեռացման համար:');


	App_Cache()->purge();
	Ext::sendResponse(true);
}
catch(App_Exception_NonCritical $e)
{
	Ext::sendErrorResponse($e->getMessage());
}
