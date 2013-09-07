<?php
user_auth_check();

$lang_ids = array();
if(empty($_GET['lang_ids']))
{
	if(1==$_REQUEST['default_language_only'])
	{
		$oLanguages = new Languages();
		$lang_ids[] = $oLanguages->getDefaultLanguage()->id;
	}
}
else
{
	$lang_ids = $_GET['lang_ids'];
	$lang_ids = explode(',', $lang_ids);
}

$merge_content_data = (1==$_REQUEST['merge_content_data'] && 1==count($lang_ids));

$include_ws_consumers = App_Registry::get('temp_sn')->user_is_root;
$search = array(
	'user.show_all' => (1==$_REQUEST['show_all']) || Acl()->allowed('user.show_all'),
	'user.show_all_in_notarial_office' => (1==$_REQUEST['show_all_in_notarial_office']) || Acl()->allowed('user.show_all_in_notarial_office'),
	'is_ws_consumer' => ($include_ws_consumers && 1==$_REQUEST['is_ws_consumer']) ? 1 : 0
);

if(!empty($_REQUEST['is_notary']))
    $search['is_notary'] = (1==$_REQUEST['is_notary']) ? 1 : 0;

if(!empty($_REQUEST['user_id']))
	$search['user_id'] = $_REQUEST['user_id'];

if(!empty($_REQUEST['community_id']))
    $search['community_id'] = $_REQUEST['community_id'];



$cache_id = 'users_'.md5(serialize(array($merge_content_data, $search, $lang_ids)));
//if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$c = -1;
	$current_id = null;
	$o = new Users();
	$result = $o->getUsers($search, $lang_ids);
	while($row = $o->db_fetch_array($result))
	{
		$id = $row['id'];
		if($merge_content_data)
		{
			$items[] = array(
				'id' => $id,
				'username' => $row['username'],
				'email' => $row['email'],
				'fax_number' => $row['fax_number'],
				'phone' => $row['phone'],
				'phone_mobile' => $row['phone_mobile'],
				'notary_code' => $row['notary_code'],
				'is_ws_consumer' => $row['is_ws_consumer'],
				'has_position' => $row['has_position'],
				'is_notary' => $row['is_notary'],
				'lang_id' => $row['lang_id'],
				'first_name' => $row['first_name'],
				'last_name' => $row['last_name'],
				'second_name' => $row['second_name']
			);
		}
		else
		{
			if($id != $current_id)
			{
				$current_id = $id;
				$items[] = array(
					'id' => $current_id,
					'username' => $row['username'],
					'email' => $row['email'],
					'passport' => $row['passport'],
					'ssn' => $row['ssn'],
					'fax_number' => $row['fax_number'],
					'phone' => $row['phone'],
					'phone_mobile' => $row['phone_mobile'],
					'notary_code' => $row['notary_code'],
					'is_ws_consumer' => $row['is_ws_consumer'],
					'has_position' => $row['has_position'],
					'is_notary' => $row['is_notary'],
					'content' => array()
				);
				++$c;
			}

			if(!empty($row['lang_id']))
			{
				$items[$c]['content'][] = array
				(
					'user_id' => $current_id,
					'lang_id' => $row['lang_id'],
					'first_name' => $row['first_name'],
					'last_name' => $row['last_name'],
					'second_name' => $row['second_name']
				);
			}
		}
	}
	App_Cache()->set($cache_id, $items, null, array(Users::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
