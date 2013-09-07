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

$detailed = $_REQUEST['detailed'];
$visible_only = $_REQUEST['visible_only'];

$cache_id = 'document_types_'.md5(serialize(array($visible_only, $detailed, $lang_ids)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$current_id = null;
	$currentItemRef = null;
	$oItems = new Document_Types();

	$stack = array(array());
	$stack_top = 0;

	$root_id = ($row = $oItems->getRootItem()) ? $row['idd'] : null;

	$result = $oItems->getItemsTree($visible_only, $detailed, $lang_ids);
	while($row = $oItems->db_fetch_array($result))
	{
		if($row['xml_tag']==='0')    //0 means closing tag
		{
			--$stack_top;
			$stack[$stack_top][count($stack[$stack_top])-1]['data'] = array_pop($stack);
		}
		else
		{
			$id = $row['id'];
			if($id != $current_id)
			{
				$current_id = $id;
				$item = array(
					'id' => $current_id,
					'parent_id' => ($root_id == $row['parent_id']) ? 0 : $row['parent_id'],
					'content' => array()
				);
				if($detailed)
				{
					$item = array_merge($item, array(
						'parent_label' => $row['parent_label'],
						'tr_type_id' => $row['tr_type_id'],
						'tr_type_label' => $row['tr_type_label'],
						'doc_type_code' => $row['doc_type_code'],
						'order_in_list' => $row['order_in_list'],
						'hidden' => $row['hidden'],
						'is_used_in_portal' => $row['is_used_in_portal']
					));
				}

				if(1 == $row['xml_tag'])
					$item['leaf'] = true;

				$stack[$stack_top][] = $item;
				$currentItemRef = & $stack[$stack_top][count($stack[$stack_top])-1];

				if($row['xml_tag']!=='1')    // right-left=1 means that node doesn't have children, so use shorthand xml syntax
				{
					array_push($stack, array());
					++$stack_top;
				}
			}
			if(!empty($row['lang_id']))
			{
				$currentItemRef['content'][] = App_Array::pick($row, 'lang_id', 'label');
			}
		}
	}
	$items = $stack[$stack_top];
	App_Cache()->set($cache_id, $items, null, array(Document_Types::CACHE_TAG), true);
}
//Logger::out($items);
Ext::sendResponse(true, array(
	'data' => $items
));
