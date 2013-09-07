<?php
//Security. Set ALLOW_MAINTENANCE_SCRIPTS=1 in config to be able to run this script.
if(!defined('ALLOW_MAINTENANCE_SCRIPTS') or !ALLOW_MAINTENANCE_SCRIPTS) die('Maintenance scripts are disabled');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Maintenance. Drop slow query logs.</title>
</head>
<body>
	<pre>
	<?
	error_reporting(E_ALL);
	$username = urldecode($_REQUEST['username']);
	$password = urldecode($_REQUEST['password']);
	
	$oUsers = new Users();
	if($row_user = $oUsers->checkCredentials($username, $password))
	{
		if($row_user['is_root'] == 1)
		{
			$iterator = new RecursiveIteratorIterator(
				new RecursiveDirectoryIterator('logs/slow_queries/'),
                RecursiveIteratorIterator::CHILD_FIRST
            );
			foreach($iterator as $itObj)
			{
				if($itObj->isDir())
				{
					rmdir($itObj->__toString());
				}
				else
				{
					unlink($itObj->__toString());
				}
			}
		    echo 'Slow query logs dropped.';
		}
		else
		{
			echo 'Only root user can drop slow query logs.';
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
