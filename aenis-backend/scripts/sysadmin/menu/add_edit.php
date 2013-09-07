<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'app_id' => $data->app_id,
		'parent_id' => $data->parent_id,
		'title' => $data->title,
		'has_menu_sep' => $data->has_menu_sep,
		'menu_order' => $data->menu_order,
		'is_enabled' => $data->is_enabled,
		'command' => $data->command,
		'has_toolbar_button' => $data->has_toolbar_button,
		'has_toolbar_sep' => $data->has_toolbar_sep,
		'toolbar_order' => $data->toolbar_order
	);
	if(!$data->auto_sync_with_resource)
	{
		$update_array['resource_id'] = $data->resource_id;
	}

	if(empty($id))
    {
		if(Acl()->denied('menu.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ մենյուի ավելացման համար:');

		if($data->auto_sync_with_resource)
		{
			$resource_code = 'menu.'.$data->command;
			$resource_title = 'Մենյու. '.$data->title;
			$oRes = new Resources();
			$result = $oRes->getResources(array('strict'=>true, 'title'=>$resource_title, 'code'=>$resource_code));
			if(!$oRes->db_fetch_array($result))
			{
				$update_array['resource_id'] = $oRes->addResource(
					array('title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MENU)
				);
			}
		}

        $o = new Menu();
        $id = $o->addMenu($update_array);
    }
    else
    {
		if(Acl()->denied('menu.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ մենյուի խմբագրման համար:');

		$o = new Menu();
		if($data->auto_sync_with_resource)
		{
			$result = $o->getMenus(array('menu_id'=>$id));
			if($row = $o->db_fetch_array($result)) //get resource to which menu is attached
			{
				$resource_id = $row['resource_id'];
			}

			$resource_code = 'menu.'.$data->command;
			$resource_title = 'Մենյու. '.$data->title;
			$oRes = new Resources();
			if(empty($resource_id)) //menu is not attached to any resource
			{
				$result = $oRes->getResources(array('strict'=>true, 'title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MENU));
				if($row = $oRes->db_fetch_array($result))
				{
					$update_array['resource_id'] = $row['id'];
				}
				else
				{
					$update_array['resource_id'] = $oRes->addResource(
						array('title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MENU)
					);
				}
			}
			else //menu is attached to some resource, update that resource
			{
				$oRes->updateResource(
					$resource_id,
					array('title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MENU)
				);
				$update_array['resource_id'] = $resource_id;
			}
		}
		$o->updateMenu($id, $update_array);
    }

    $o->db_commit();
	Ext::sendResponse(true, array(
		'data' =>array('id' => $id)
	));
}
catch(App_Exception_NonCritical $e)
{
	if(null!==$o) $o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
