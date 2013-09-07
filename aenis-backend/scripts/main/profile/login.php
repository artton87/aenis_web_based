<?
$username = urldecode($_POST['username']);
$password = urldecode($_POST['password']);

$oUsers = new Users();
try {
	if($row_user = $oUsers->checkCredentials($username, $password))
	{
		$session_user_id = $row_user['id'];
		App_Registry::get('temp_sn')->user_id = $session_user_id;
		App_Registry::get('temp_sn')->is_ws_consumer = ($row_user['is_ws_consumer']==1) ? true : false;
		App_Registry::get('temp_sn')->user_is_root = ($row_user['is_root']==1) ? true : false;
		App_Registry::get('temp_sn')->user_data = $row_user;

		$user_staffs = array();
		$oUserPositions = new User_Positions();
		$result_staff = $oUserPositions->getUserStaffs($session_user_id);
		while($row_staff = $oUserPositions->db_fetch_array($result_staff))
		{
			$user_staffs[] = $row_staff['staff_id'];
		}
		App_Registry::get('temp_sn')->user_staffs = $user_staffs;

		$allowed_resources = array();
		$oUserResources = new User_Resources();
		$result = $oUserResources->getAllowedResources($session_user_id);
		while($row = $oUserResources->db_fetch_array($result))
		{
			$allowed_resources[$row['id']] = $row['code'];
		}

		Acl()->update($allowed_resources);

		$oUsers->db_commit();
		Ext::sendResponse(true, array(
			'user_id' => $session_user_id
		));
	}
	else
	{
		throw new App_Exception_Validate('Սխալ ծածկանուն կամ գաղտնաբառ:');
	}
}
catch(App_Exception_NonCritical $e)
{
	$oUsers->db_rollback();
	Ext::sendResponse(false, array(
		'errors' => array(
			'reason' => $e->getMessage()
		)
	));
}
