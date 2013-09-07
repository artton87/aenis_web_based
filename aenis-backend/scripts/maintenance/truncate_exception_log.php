<?php
//Security. Set ALLOW_MAINTENANCE_SCRIPTS=1 in config to be able to run this script.
if(!defined('ALLOW_MAINTENANCE_SCRIPTS') or !ALLOW_MAINTENANCE_SCRIPTS) die;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Maintenance. Truncate exception log.</title>
</head>
<body>
	<pre>
	<?
	$username = urldecode($_REQUEST['username']);
	$password = urldecode($_REQUEST['password']);
	
	$oUsers = new Users();
	if($row_user = $oUsers->checkCredentials($username, $password))
	{
		if($row_user['is_root'] == 1)
		{
			$handle = fopen('../logs/exception.log', 'w');
		    fclose($handle);
		    echo 'Exception log truncated.';
		}
		else
		{
			echo 'Only root user can truncate exception log.';
		}
	}
	else
	{
		echo 'Cannot login to system. Invalid username/password combination.';
	}
	?>
	</pre>
</body>
</html>
