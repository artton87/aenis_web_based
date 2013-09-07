<?php
user_auth_check(TRUE);

if(Acl()->allowed('notaries.get'))
{
	$oNotaries = new Notaries;
	$params = App_Json::decode($_POST['params'], TRUE);
	$result = $oNotaries->getNotaries($params['search'], $params['lang_id'], $params['return_count']);
	if($params['return_count'])
	{
		Ext::sendResponse(true, array(
			'data' => $result
		));
	}
	else
	{
		while($row = $oNotaries->db_fetch_array($result))
		{
			$notaries[] = $row;
		}
		Ext::sendResponse(true, array(
			'data' => $notaries
		));
	}
}
else
{
	Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ նոտարների ցանկը ստանալու համար:');
}