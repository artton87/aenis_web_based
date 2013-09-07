<?php
user_auth_check();

$filters = json_decode($_GET['filter'], true);

$search = array();
foreach($filters as $filter)
{
	$search[$filter['property']] = $filter['value'];
}

$cache_id = 'transaction_type_property_types_'.md5(serialize(array($search)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$o = new Transaction_Type_Property_Types();
	$result = $o->getRecords($search);
	while($row = $o->db_fetch_array($result))
	{
		$items[] = array(
			'tr_type_id' => $row['tr_type_id'],
			'property_type_id' => $row['property_type_id'],
			'is_required' => $row['is_required'],
			'order_in_list' => $row['order_in_list'],
			'property_type_label' => $row['property_type_label'],
			'property_type_code' => $row['property_type_code'],
			'property_type' => $row['property_type']
		);
	}
	App_Cache()->set($cache_id, $items, null, array(
		Transaction_Type_Property_Types::CACHE_TAG,
		Transaction_Property_Types::CACHE_TAG,
		Transaction_Types::CACHE_TAG
	), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));

