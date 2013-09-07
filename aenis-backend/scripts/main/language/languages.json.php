<?php
user_auth_check();

$items = array();

$o = new Languages();
$languages = $o->getLanguages();
foreach($languages as $lang)
{
	$items[] = array(
		'id' => $lang->id,
		'code' => $lang->code,
		'title' => $lang->title,
		'is_default' => $lang->is_default
	);
}

Ext::sendResponse(true, array(
	'data' => $items
));
