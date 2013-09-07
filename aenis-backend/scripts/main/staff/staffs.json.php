<?php
user_auth_check();

$detailed = $_REQUEST['detailed'];

$search = array();
if(!empty($_REQUEST['staff_id']))
	$search['staff_id'] = $_REQUEST['staff_id'];

$cache_id = 'staff_'.md5(serialize(array(0, $detailed, $search)));
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$oItems = new Staff();
	if($detailed) //roles are needed only in detailed mode
		$oRoles = new Staff_Roles();
	
	$stack = array(array());
	$stack_top = 0;

	$root_id = ($row = $oItems->getRootMember()) ? $row['id'] : null;

	$result = $oItems->getMembers($root_id, $detailed, $search);
	while($row = $oItems->db_fetch_array($result))
	{
		if($row['xml_tag']==='0')    //0 means closing tag
		{
			--$stack_top;
			$stack[$stack_top][count($stack[$stack_top])-1]['data'] = array_pop($stack);
		}
		else
		{
			$item = array(
				'id' => $row['id'],
				'title' => $row['title'],
				'dep_id' => $row['dep_id'],
				'dep_title' => $row['dep_title'],
				'parent_id' => ($root_id == $row['parent_id']) ? 0 : $row['parent_id'],
				'iconCls' => 'tree-' . (empty($row['active_user_id']) ? 'vacant' : 'occupied')
			);
			if($detailed)
			{
				$roles = array();
				$roles_result = $oRoles->getRoles($row['id']);
				while($role_row = $oRoles->db_fetch_array($roles_result))
				{
					$roles[] = array('staff_id'=>$row['id'], 'role_id' => $role_row['id'], 'title' => $role_row['title'] );
				}
				$item = array_merge($item, array(
					'parent_title' => $row['parent_title'],
					'staff_order' => $row['num'],
					'roles' => $roles
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
	$items = $stack[$stack_top];
	App_Cache()->set($cache_id, $items, null, array(Staff::CACHE_TAG, Roles::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
