<?php
$type = $_REQUEST['type'];

if('debug_log' == $type || 'exception_log' == $type)
{
	if('debug_log' == $type)
	{
		$filename = Logger::getDebugLogPath();
	}
	elseif('exception_log' == $type)
	{
		$filename = Logger::getExceptionLogPath();
	}

	$handle = fopen($filename, 'w');
	fclose($handle);
}

Ext::sendResponse(true);
