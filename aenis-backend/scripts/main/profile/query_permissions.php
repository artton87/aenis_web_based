<?php
user_auth_check();

$result = array();
$resource_codes = $_POST['resource_codes'];
if(!empty($resource_codes))
{
	$resource_codes = explode(',', $resource_codes);
	foreach($resource_codes as $resource_code)
	{
		$result[$resource_code] = Acl()->allowed($resource_code);
	}
}

$is_root = (true == App_Registry::get('temp_sn')->user_is_root);

Ext::sendResponse(true, array(
	'data' => array(
		'is_root' => $is_root,
		'query_result' => $result
	)
));

