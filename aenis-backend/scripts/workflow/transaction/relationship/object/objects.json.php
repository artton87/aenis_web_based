<?php
user_auth_check();
try
{
	$search = array();
	if(!empty($_GET['filter']))
	{
		$filters = json_decode($_GET['filter'], TRUE);

		foreach($filters as $filter)
		{
			$search[$filter['property']] = $filter['value'];
		}
	}
	
	$oObjects = new Objects();
	$result = $oObjects->getObjects($search);
	$return = array();
	while($row = $oObjects->db_fetch_array($result))
	{
        $obj_name = '';
        $obj_data = unserialize($row['object_data']);
        switch($row['code'])
        {
            case 'vehicle':
                $obj_name = $obj_data['number'] . ' ' . $obj_data['color'] . ' ' . $obj_data['body_type'] . ' ' . $obj_data['type'] . ' ' . $obj_data['model'] . ' ' . $obj_data['model_year'];
                break;
            case 'realty':
                break;
            case 'share':
                break;
            case 'stock':
                break;
            case 'other':
                break;
        }
        $return[] = array(
			'id' => $row['id'],
			'rel_id' => $row['rel_id'],
            'objectId' => $row['object_id'],
            'objectName' => $obj_name,
            'objectType' => $row['code'],
            'objectTypeLabel' => $row['type_label'],
            'objectData' => $row['object_data'],
		);
	}

	Ext::sendResponse(true, array('data'=>$return));
}
catch(App_Exception_NonCritical $e)
{
	Ext::sendErrorResponse($e->getMessage());
}
