<?php
//session object
$oSession = App_Registry::get('temp_sn');


//use this length to distinguish this keys from another session variables
//it is assumed, that nobody will use session variable with length == key_length
$key_length = 32;

if(array_key_exists('id', $_REQUEST))
{
	$key = substr(str_pad(md5(time()),$key_length,'x'), 0, $key_length);
	$oSession->setItem($key, new App_Session_Item_Object($_REQUEST['id']), 'remote_file_view');
	Ext::sendResponse(true, array('key'=>$key));
	exit;
}

$file_id = 0;
$force_download = false;
if(array_key_exists('key',$_GET) && strlen($_GET['key'])==$key_length)
{
	$force_download = $_GET['force_download'] ? true : false;
	$key = $_GET['key'];
	$file_id = $oSession->getItem($key, 'remote_file_view');
	if(null === $file_id)
	{
		echo 'Access denied !';
		exit;
	}
	$oSession->unsetItem($key, 'remote_file_view');
}

//do not continue if file id is empty
if(empty($file_id)) exit;

//read file and send to browser
$oFiles = new Files();

if($row = $oFiles->getById($file_id))
{
	$file_name = $row['file_name'];
	$file_path = CFG_FILE_STORAGE.$row['path'].$row['file_path'];


	$file_size = filesize($file_path.$file_name);
	if($file_size>0)
	{
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header('Cache-Control: post-check=0, pre-check=0', false);
		header('Pragma: no-cache');

		if($force_download)
		{
			header('Content-Disposition: attachment; filename='.$file_name);
		}
		else
		{
			header('Content-Disposition: inline; filename='.$file_name);
		}
		header('Content-Length: '.$file_size);

		$extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
		switch($extension)
		{
			case 'jpg':
			case 'jpeg':
			case 'jpe':
				header('Content-Type: image/jpeg;');
				break;
			case 'gif':
				header('Content-Type: image/gif;');
				break;
			case 'png':
				header('Content-Type: image/x-png;');
				break;
			case 'bmp':
				header('Content-Type: image/x-ms-bmp;');
				break;
			case 'tif':
			case 'tiff':
				header('Content-Type: image/tiff;');
				break;
			case 'pdf':
				header('Content-Type: application/pdf;');
				break;
			case 'doc':
				header('Content-Type: application/msword;');
				break;
			case 'xls':
				header('Content-Type: application/vnd.ms-excel;');
				break;
			default:
				header('Content-Type: application/x-msdownload');
				break;
		}
		@readfile($file_path.$file_name);
	}
}


