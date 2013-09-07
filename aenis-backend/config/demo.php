<?php

/**
 * Turn on/off error reporting
 */
error_reporting(0);

/**
 * If true, logs all exceptions into /logs/exception.log
 */
define('CFG_ENABLE_EXCEPTION_LOG', true);

/**
 * Whenever allow exception output to browser
 */
define('CFG_ENABLE_EXCEPTION_OUTPUT', false);

/**
 * Database connection options
 */
define('CFG_DB_HOST', 'localhost');
define('CFG_DB_USER', 'armdatin_moj');
define('CFG_DB_PASS', 'R%H]hvTym)LK');
define('CFG_DB_NAME', 'armdatin_aenis');
define('CFG_DB_PORT', '3306');
define('CFG_DB_CHARSET', 'UTF8');

/**
 * Path to file storage
 */
define('CFG_FILE_STORAGE', '/home/armdatin/public_html/demo_bestsoft/aenis/php/storage/');

/**
 * Cache directory
 */
define('CFG_CACHE_STORAGE', '/home/armdatin/public_html/demo_bestsoft/aenis/php/cache/');

/**
 * Enotary website url
 */
define('ENOTARY_URL', 'demo.bestsoft.am/enotary/');

/**
 * 1 - enable running of scripts in /maintenance/ catalog, 0 - disable.
 * /maintenance/ catalog contains scripts, which are intended to be run by application server administrators.
 */
define('ALLOW_MAINTENANCE_SCRIPTS', 1);
