<?php 

/**
 * Session name
 */
define('CFG_SESSION_NAME', 'aenis');

/**
 * Logging path
 */
define('CFG_LOGGING_PATH', 'logs/');

/**
 * 1 - enable permission checks, 0 - disable
 */
define('CFG_PERMISSIONS_ENABLED', 1);

/**
 * Timeout value for query in seconds.
 * Setting this to 0 will disable logging of slow queries.
 */
define('CFG_QUERY_TIMEOUT', 0);

/**
 * Non-working days in a week, index is 1-based
 */
define('WEEKEND_DAYS', '6,7'); //1-based Saturday,Sunday

/**
 * Configuration for Visa and Passport Department web service
 */
define('AVV_SERVICE_URL', 'http://102.102.100.164/avvsrv/AVVWebService.asmx');
define('AVV_SERVICE_WSDL', 'http://102.102.100.164/avvsrv/AVVWebService.asmx?WSDL');
define('AVV_SERVICE_URI', 'http://tempuri.org/');

