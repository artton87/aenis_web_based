<?php
user_auth_check();

$filters = App_Json::decode($_GET['filter'], true);

$search = array();
foreach($filters as $filter)
{
	$search[$filter['property']] = $filter['value'];
}
$template_variable_id = $search['template_variable_id'];

$cache_id = 'template_variable_parameters_'.md5(serialize(array($template_variable_id)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();
	$oVariable = Template_Variables::factory($template_variable_id);
	$parameters = $oVariable->getParameters();
	foreach($parameters as $param)
	{
		$item = App_Array::pick($param, 'name', 'display_name', 'is_required');
		$item['template_variable_id'] = $template_variable_id;
		$item['acceptableValues'] = array();
		foreach($param->values as $value)
		{
			$item['acceptableValues'][] = App_Array::pick($value, 'value', 'display_name');
		}
		$items[] = $item;
	}
	App_Cache()->set($cache_id, $items, null, array(Template_Variables::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
