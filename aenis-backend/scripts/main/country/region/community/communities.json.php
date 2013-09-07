<?php
user_auth_check();

$lang_ids = array();
if($_REQUEST['default_language_only'])
{
	$oLanguages = new Languages();
	$lang_ids = array($oLanguages->getDefaultLanguage()->id);
}
else
{
	if(!empty($_GET['lang_ids']))
	{
		$lang_ids = $_GET['lang_ids'];
		$lang_ids = explode(',', $lang_ids);
	}
}

$search = array();
if(!empty($_GET['region_id']))
	$search['region_id'] = $_GET['region_id'];

$cache_id = 'communities_'.md5(serialize(array($search, $lang_ids)));
//if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();

	$c = -1;
	$current_id = null;
	$o = new Country_Region_Communities();
	$result = $o->getCommunities($search, $lang_ids);
	while($row = $o->db_fetch_array($result))
	{
		$id = $row['id'];
		if($id != $current_id)
		{
			$current_id = $id;
			$items[] = array(
				'id' => $current_id,
				'is_urban' => $row['is_urban'],
				'region_id' => $row['region_id'],
				'content' => array()
			);
			++$c;
		}

		if(!empty($row['lang_id']))
		{
			$items[$c]['content'][] = array(
				'lang_id' => $row['lang_id'],
				'name' => $row['name']
			);
		}
	}

	App_Cache()->set($cache_id, $items, null, array(Country_Region_Communities::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
