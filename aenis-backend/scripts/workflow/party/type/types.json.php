<?php
user_auth_check();

$cache_id = 'party_types';
//if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Party_Types();
	$current_id = null;
	$currentItemRef = null;

	$stack = array(array());
	$stack_top = 0;

	$result = $o->getTypes();
	while($row = $o->db_fetch_array($result))
	{
		$id = $row['id'];
		if ($id != $current_id)
		{
			$current_id = $id;
			$item = array(
				'id' => $current_id,
				'label' => $row['label'],
				'party_type_code' => $row['party_type_code'],
				'content' => array()
			);

			$stack[$stack_top][] = $item;
			$currentItemRef = & $stack[$stack_top][count($stack[$stack_top])-1];

		}
		if(!empty($row['lang_id']))
		{
			$currentItemRef['content'][] = App_Array::pick($row, 'lang_id', 'label');
		}
	}
	$items = $stack[$stack_top];
	App_Cache()->set($cache_id, $items, null, array(Party_Types::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
