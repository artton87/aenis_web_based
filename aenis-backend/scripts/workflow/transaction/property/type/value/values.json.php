<?php
user_auth_check();

$filters = json_decode($_GET['filter'], true);

$search = array();
foreach($filters as $filter)
{
	$search[$filter['property']] = $filter['value'];
}

$cache_id = 'transaction_property_types_values_'.md5(serialize(array($search)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Transaction_Property_Type_Values();
	$result = $o->getValues($search);
	while($row = $o->db_fetch_array($result))
	{
		$items[] = App_Array::pick($row,
			'id',
			'tr_property_type_id',
			'label'
		);
	}
	App_Cache()->set($cache_id, $items, null, array(
		Transaction_Property_Type_Values::CACHE_TAG,
		Transaction_Property_Types::CACHE_TAG,
		Transaction_Types::CACHE_TAG
	), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));

