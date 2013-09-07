<?php
//directory layout structure
define('CONFIGURATIONS_PATH', 'config/');
define('LIBRARY_PATH', 'library/');
define('MODELS_PATH', 'models/');
define('SCRIPTS_PATH', 'scripts/');

//include configuration files
require_once CONFIGURATIONS_PATH.'common.php';
require_once CONFIGURATIONS_PATH.APPLICATION_ENV.'.php';

//setup automatic class loader
require_once LIBRARY_PATH.'App/Loader.php';
App_Loader::init(array(LIBRARY_PATH, MODELS_PATH));

//use HTTPOnly cookies for holding PHPSESSID to be more secure
$currentCookieParams = session_get_cookie_params(); 
session_set_cookie_params(
     $currentCookieParams['lifetime'],
     $currentCookieParams['path'],
     $currentCookieParams['domain'],
     $currentCookieParams['secure'],
     true
);

//Session Initialisation
if(!defined('API_MODE') || !API_MODE)
{
	session_cache_limiter('private_no_expire');
	//session_cache_expire(30);
}
else
{
	session_cache_limiter('nocache');
}
session_name(CFG_SESSION_NAME);
session_start();

//setup exception and debug logger
Logger::setExceptionLogPath(CFG_LOGGING_PATH.'exception.log');
Logger::setDebugLogPath(CFG_LOGGING_PATH.'debug.log');

//make all errors to be handled by App_Exception
App_Exception::setupErrorHandler();

//setup session namespaces and store them into registry
// temp_sn - has stored values only after logging in, and will be cleared after logout
// global_sn - is always available
App_Registry::set('temp_sn', new App_Session_Namespace('temp'));
App_Registry::set('global_sn', new App_Session_Namespace('global'));

//setup Acl
Acl::instance()
	->enable(1 == CFG_PERMISSIONS_ENABLED)
	->setSessionNamespace(App_Registry::get('temp_sn'));

//default timezone
date_default_timezone_set('Asia/Yerevan');

//Headers
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

/* Set internal character encoding to UTF-8 */
mb_internal_encoding('UTF-8');
mb_regex_encoding('UTF-8');

//setup json encoder
App_Json::useNativePhpEncoder(true);

//setup database adapter
$dba = new App_Db_Adapter_Mysql();
$dba->setConnectionOptions(CFG_DB_HOST, CFG_DB_USER, CFG_DB_PASS, CFG_DB_NAME, CFG_DB_PORT, 'utf8');
$dba->setTablePrefix('bs_');

if(0 != CFG_QUERY_TIMEOUT)
{
	$oQueryTimeoutLogger = new App_Db_QueryTimeoutLogger();
	$oQueryTimeoutLogger->setTimoutTime(CFG_QUERY_TIMEOUT);
	$oQueryTimeoutLogger->setLoggingPath(CFG_LOGGING_PATH.'slow_queries/');
	$dba->setQueryTimeoutLogger($oQueryTimeoutLogger);
}
App_Db_Table_Abstract::setAdapter($dba);

//setup cache adapter
$oCacheAdapter = new App_Cache_Adapter_File(CFG_CACHE_STORAGE.'items/', CFG_CACHE_STORAGE.'metadata/');
App_Cache::instance()->setAdapter($oCacheAdapter);

//setup root directory for all storage locations
App_File_Storage_Location::setStorageRootPath(CFG_FILE_STORAGE);

//setup storage manager
$oStorageManager = new App_File_Storage_Manager();
$oStorageManager->setCacheAdapter($oCacheAdapter);
$oStorageManager->initFromDb($dba, 'storage', 'id', 'path');
App_File_Transfer::setStorageManager($oStorageManager);


/**
 * Checks if user is authenticated and if not, sends an error message as response and exits.
 * @param bool $allow_ws_consumers    Optional. If true, allow also to web service consumer users
 */
function user_auth_check($allow_ws_consumers = false)
{
   
	$user_id = App_Registry::get('temp_sn')->user_id;
	$is_ws_consumer = App_Registry::get('temp_sn')->is_ws_consumer;
	if(empty($user_id) || ($is_ws_consumer && !$allow_ws_consumers))
	{
		$data = array('errors'=>array());
		if(defined('API_MODE') && 1==API_MODE)
		{
			list($client, $password) = explode(':', $_SERVER['HTTP_USER_AGENT'], 2);
			$data['errors']['reason'] = 'Client #'.$client.' is not allowed to access the system';
		}
		else
		{
			$data['logout'] = true;
			$data['errors']['reason'] = 'Աշխատանքային սեսիան ավարտվել է: Շարունակելու համար նորից մուտք գործեք համակարգ:';
		}
		Ext::sendResponse(false, $data);
		exit;
	}
}
