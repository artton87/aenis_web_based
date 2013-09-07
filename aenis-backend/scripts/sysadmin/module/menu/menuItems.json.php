<?php
user_auth_check();

$items = array();

$app_id = $_REQUEST['app_id'];
$detailed = $_REQUEST['detailed'];

$oMenu = new Menu();

$stack = array(array());
$stack_top = 0;

$root_id = ($row = $oMenu->getRootMenu($app_id)) ? $row['idd'] : 0;

$result = $oMenu->getMenuTree($app_id, false, $detailed);
while($row = $oMenu->db_fetch_array($result))
{
	if($row['xml_tag']==='0')    //0 means closing tag
	{
		$stack[$stack_top-1][count($stack[$stack_top-1])-1]['data'] = array_pop($stack);
		--$stack_top;
	}
	else
	{
		$item = array(
			'id' => $row['id'],
			'title' => $row['title'],
			'parent_id' => ($root_id == $row['parent_id']) ? 0 : $row['parent_id'],
		);
		if($detailed)
		{
			$item = array_merge($item, array(
				'parent_title' => $row['parent_title'],
				'command' => $row['command'],
				'is_enabled' => $row['is_enabled'],
				'resource_id' => $row['resource_id'],
				'has_menu_sep' => $row['has_menu_sep'],
				'menu_order' => $row['menu_order'],
				'has_toolbar_button' => $row['has_toolbar_button'],
				'has_toolbar_sep' => $row['has_toolbar_sep'],
				'toolbar_order' => $row['toolbar_order']
			));
		}

		if(1 == $row['xml_tag'])
			$item['leaf'] = true;

		$stack[$stack_top][] = $item;

		if($row['xml_tag']!=='1')    // right-left=1 means that node doesn't have children, so use shorthand xml syntax
		{
			array_push($stack, array());
			++$stack_top;
		}
	}
}

Ext::sendResponse(true, array(
	'data' => $stack[$stack_top]
));
