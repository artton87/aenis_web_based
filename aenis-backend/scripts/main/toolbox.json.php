<?php
user_auth_check();

$app_id = $_GET['module'];
if(empty($app_id))
	$app_id = App_Registry::get('temp_sn')->app_id;

$oMenu = new Menu();

$stack = array(array());
$stack_top = 0;

$root_id = ($row = $oMenu->getRootMenu($app_id)) ? $row['idd'] : 0;
$user_is_root = App_Registry::get('temp_sn')->user_is_root;

$acl = Acl();
$result = $oMenu->getMenuTree($app_id, true);
while($row = $oMenu->db_fetch_array($result))
{
	if($row['xml_tag']==='0')    //0 means closing tag
	{
		$top = array_pop($stack);
		--$stack_top;
		if(empty($top)) //there were child items, but all of them are not permitted for view
		{
			array_pop($stack[$stack_top]); //do not show an empty parent
		}
		else
		{
			$stack[$stack_top][count($stack[$stack_top])-1]['data'] = $top;
		}
	}
	else
	{
		if($row['xml_tag']==='1') //check permissions only for leaf nodes
		{
			if(!$user_is_root && $row['resource_id'] && $acl->denied($row['resource_id'], true)) continue;
		}

		$stack[$stack_top][] = array(
			'id' => $row['id'],
			'parent_id' => ($root_id == $row['parent_id']) ? 0 : $row['parent_id'],
			'command' => $row['command'],
			'title' => $row['title'],
			'has_menu_sep' => $row['has_menu_sep'],
			'has_toolbar_button' => $row['has_toolbar_button'],
			'has_toolbar_sep' => $row['has_toolbar_sep'],
			'toolbar_order' => $row['toolbar_order']
		);

		if($row['xml_tag']!=='1')    //node has children, push node to stack
		{
			array_push($stack, array());
			++$stack_top;
		}
	}
}

Ext::sendResponse(true, array(
	'data' => $stack[$stack_top]
));
