<?php
//set current application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

chdir('../../aenis-backend/');

//Further configuration goes into try/catch block.
//That way all possible exceptions will be caught.
try {
	$xRequested = $_SERVER['HTTP_X_REQUESTED_WITH'];
	if(0 === stripos($xRequested, 'aenis_ws_client')) //web service request
	{
		define('API_MODE', 1);
	}

	//do remaining configuration
	include_once 'bootstrap.php';

	//determining user id
	if(defined('API_MODE') && 1==API_MODE)
	{
		list($agent, $password) = explode(':', $_SERVER['HTTP_USER_AGENT'], 2);
		$oUsers = new Users();
		if($row_user = $oUsers->checkWebServiceClientCredentials($agent, $password))
		{
			App_Registry::get('temp_sn')->user_id = $row_user['id'];
			App_Registry::get('temp_sn')->is_ws_consumer = ($row_user['is_ws_consumer']==1) ? true : false;
			App_Registry::get('temp_sn')->user_is_root = ($row_user['is_root']==1) ? true : false;
			App_Registry::get('temp_sn')->user_data = $row_user;
			App_Registry::get('temp_sn')->user_staffs = array();
			App_Registry::get('temp_sn')->notarial_office_id = 0;

			$allowed_resources = array();
			$oUserResources = new User_Resources();
			$result = $oUserResources->getWebServiceClientAllowedResources($row_user['id']);
			while($row = $oUserResources->db_fetch_array($result))
			{
				$allowed_resources[$row['id']] = $row['code'];
			}
			Acl()->update($allowed_resources);
		}
	}

	//dispatch request
	$oDispatcher = new App_Dispatcher_Simple();
	$oDispatcher->setScriptDirectory(SCRIPTS_PATH);
	$oDispatcher->dispatch();
}
catch(Exception $e)
{
	$code = $e->getCode();
	if(!is_subclass_of($e, 'App_Exception_NonCritical') AND get_class($e) != 'App_Exception_NonCritical')
	{
		if(empty($code))
			$code = 500; //respond with Error 500 - bad request in case of critical exception
	}

	if(!empty($code) && $code>99 && $code<600 && !headers_sent())
	{
		header(':', true, $code);
	}

	if(defined('CFG_ENABLE_EXCEPTION_LOG') && CFG_ENABLE_EXCEPTION_LOG)
	{
		$oLog = new Logger();
		$oLog->logException($e);
	}

	if(defined('CFG_ENABLE_EXCEPTION_OUTPUT') && CFG_ENABLE_EXCEPTION_OUTPUT)
	{
		Ext::sendErrorResponse($e->getMessage());
	}
}
