<?php
user_auth_check();

$user_id = App_Registry::get('temp_sn')->user_id;

$cache_id = 'user_notaries_'.md5(serialize(array($user_id)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$oLanguages = new Languages();
	$lang_id = $oLanguages->getDefaultLanguage()->id;

	$items = array();
	$o = new Users();
	$result = $o->getUserNotaries($user_id, $lang_id);
	while($row = $o->db_fetch_array($result))
	{
		$id = $row['id'];
		$items[] = array(
			'id' => $id,
			'notary_code' => $row['notary_code'],
			'lang_id' => $row['lang_id'],
			'first_name' => $row['first_name'],
			'last_name' => $row['last_name'],
			'second_name' => $row['second_name']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(Users::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
