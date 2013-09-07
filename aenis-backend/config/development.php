<?php

/**
 * Turn on/off error reporting
 */
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

/**
 * If true, logs all exceptions into /logs/exception.log
 */
define('CFG_ENABLE_EXCEPTION_LOG', true);

/**
 * Whenever allow exception output to browser
 */
define('CFG_ENABLE_EXCEPTION_OUTPUT', true);

/**
 * Database connection options
 */
define('CFG_DB_HOST', '192.168.1.53');
define('CFG_DB_USER', 'bestsoft');
define('CFG_DB_PASS', 'bestsoft');
define('CFG_DB_NAME', 'aenis_web_based');
define('CFG_DB_PORT', '3306');
define('CFG_DB_CHARSET', 'UTF8');

/**
 * Path to file storage
 */
define('CFG_FILE_STORAGE', '/home/data/wwwroot/data/files/aenis/storage/');

/**
 * Enotary website url
 */
define('ENOTARY_URL', '192.168.1.52/enotary.am/www/');

/**
 * Cache directory
 */
define('CFG_CACHE_STORAGE', '/home/data/wwwroot/data/files/aenis/cache/');

/**
 * 1 - enable running of scripts in /maintenance/ catalog, 0 - disable.
 * /maintenance/ catalog contains scripts, which are intended to be run by application server administrators.
 */
define('ALLOW_MAINTENANCE_SCRIPTS', 1);
