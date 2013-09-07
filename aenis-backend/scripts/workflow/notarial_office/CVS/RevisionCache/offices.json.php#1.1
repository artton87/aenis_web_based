<?php
user_auth_check(true);

$lang_ids = array();
$search = array();

if(empty($_POST['params']))
{
	if(empty($_REQUEST['lang_ids']))
	{
		if(1==$_REQUEST['default_language_only'])
		{
			$oLanguages = new Languages();
			$lang_ids[] = $oLanguages->getDefaultLanguage()->id;
		}
	}
	else
	{
		$lang_ids = $_REQUEST['lang_ids'];
		$lang_ids = explode(',', $lang_ids);
	}
	$merge_content_data = (1==$_REQUEST['merge_content_data']);
	$search['available_for_user'] = (1==$_REQUEST['available_for_logged_in_user']) ? App_Registry::get('temp_sn')->user_id : 0;
}
else //params will be sent using JSON
{
	$params = App_Json::decode($_POST['params'], true);
	$merge_content_data = (1==$params['merge_content_data']);
	$search = $params['search'];
	$lang_ids = $params['lang_ids'];
	if(empty($lang_ids) && 1==$params['default_language_only'])
	{
		$oLanguages = new Languages();
		$lang_ids[] = $oLanguages->getDefaultLanguage()->id;
	}
}

$merge_content_data = ($merge_content_data && 1==count($lang_ids));

$cache_id = 'notarial_offices_'.md5(serialize(array($merge_content_data, $search, $lang_ids)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();

	$c = -1;
	$current_id = null;
	$o = new NotarialOffices();
	$result = $o->getOffices($search, $lang_ids);
	while($row = $o->db_fetch_array($result))
	{
		$id = $row['id'];
		if($merge_content_data)
		{
			$items[] = array(
				'id' => $id,
				'postal_index' => $row['postal_index'],
				'community_id' => $row['community_id'],
				'community_title' => $row['community_title'],
				'region_title' => $row['region_title'],
				'lang_id' => $row['lang_id'],
				'address' => $row['address']
			);
		}
		else
		{
			if($id != $current_id)
			{
				$current_id = $id;
				$items[] = array(
					'id' => $current_id,
					'postal_index' => $row['postal_index'],
					'community_id' => $row['community_id'],
					'community_title' => $row['community_title'],
					'region_title' => $row['region_title'],
					'latitude' => $row['latitude'],
					'longitude' => $row['longitude'],
					'content' => array()
				);
				++$c;
			}

			if(!empty($row['lang_id']))
			{
				$items[$c]['content'][] = array(
					'lang_id' => $row['lang_id'],
					'address' => $row['address']
				);
			}
		}
	}
	App_Cache()->set($cache_id, $items, null, array(NotarialOffices::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
