<?php
user_auth_check();

$o = null;
try {
	$data = $_POST['data'];
	$data = App_Json::decode($data);
	$id = $data->id;

	$update_array = array(
		'title' => $data->title,
		'description' => $data->description,
		'app_order' => $data->app_order,
		'is_enabled' => $data->is_enabled,
		'module' => $data->module
	);
	if(!$data->auto_sync_with_resource)
	{
		$update_array['resource_id'] = $data->resource_id;
	}

	if(empty($id))
    {
		if(Acl()->denied('module.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ մոդուլի ավելացման համար:');

		if($data->auto_sync_with_resource)
		{
			$resource_code = 'module.'.$data->command;
			$resource_title = 'Մոդուլ. '.$data->title;
			$oRes = new Resources();
			$result = $oRes->getResources(array('strict'=>true, 'title'=>$resource_title, 'code'=>$resource_code));
			if(!$oRes->db_fetch_array($result))
			{
				$update_array['resource_id'] = $oRes->addResource(
					array('title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MODULE)
				);
			}
		}

        $o = new Modules();
        $id = $o->addModule($update_array);
    }
    else
    {
		if(Acl()->denied('module.edit'))
			throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ մոդուլի խմբագրման համար:');

		$o = new Modules();
		if($data->auto_sync_with_resource)
		{
			$result = $o->getModules($id);
			if($row = $o->db_fetch_array($result)) //get resource to which menu is attached
			{
				$resource_id = $row['resource_id'];
			}

			$resource_code = 'module.'.$data->module;
			$resource_title = 'Մոդուլ. '.$data->title;
			$oRes = new Resources();
			if(empty($resource_id)) //menu is not attached to any resource
			{
				$result = $oRes->getResources(array('strict'=>true, 'title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MODULE));
				if($row = $oRes->db_fetch_array($result))
				{
					$update_array['resource_id'] = $row['id'];
				}
				else
				{
					$update_array['resource_id'] = $oRes->addResource(
						array('title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MODULE)
					);
				}
			}
			else //menu is attached to some resource, update that resource
			{
				$oRes->updateResource(
					$resource_id,
					array('title'=>$resource_title, 'code'=>$resource_code, 'type'=>Resources::TYPE_MODULE)
				);
				$update_array['resource_id'] = $resource_id;
			}
		}
		$o->updateModule($id, $update_array);
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
