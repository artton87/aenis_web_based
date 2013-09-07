<?php
$type = $_REQUEST['type'];
$tailSize = $_REQUEST['tailSize'];

if('server_info' == $type)
{
	phpinfo();
}
elseif('debug_log' == $type || 'exception_log' == $type)
{
	echo '<pre>';
	if('debug_log' == $type)
	{
		$filename = Logger::getDebugLogPath();
	}
	elseif('exception_log' == $type)
	{
		$filename = Logger::getExceptionLogPath();
	}

	$fp = fopen($filename, 'r');
	$data = fseek($fp, -$tailSize<<10, SEEK_END);
	fpassthru($fp);
	fclose($fp);
	echo '</pre>';
}
