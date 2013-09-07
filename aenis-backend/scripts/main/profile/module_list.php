<?php
$o = new Modules();
try {
	$acl = Acl();
	$modules = array();
	$result = $o->getModules(0, true);
	while($row = $o->db_fetch_array($result))
	{
		if($row['resource_id'] && $acl->denied($row['resource_id'], true)) continue;

		$modules[] = array(
			'id' => $row['id'],
			'title' => htmlspecialchars($row['title']),
			'description' => htmlspecialchars($row['description']),
			'module' => htmlspecialchars($row['module'])
		);
	}
	Ext::sendResponse(true, array('modules' => $modules));
}
catch(App_Exception_NonCritical $e)
{
	$o->db_rollback();
	Ext::sendErrorResponse($e->getMessage());
}
