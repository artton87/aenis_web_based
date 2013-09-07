<?php
require_once 'cron_env.php';
require_once '../bootstrap.php';

$oFiles = new Files();
try {
	$oStorageNodes = new Storage_Nodes();
	$hostname_mask_map = $oStorageNodes->getStorageNodeMasks();
	$current_node_mask = $oStorageNodes->getCurrentStorageNodeMask();

	//get list of masks, for which bitwise AND operation with $current_node_mask gives non-zero result
	$node_masks = array();
	for($i=1; $i<255; ++$i)
	{
		if(0 !== $current_node_mask & $i)
		{
			$node_masks[] = $i;
		}
	}

	//get files, which are missing from the current node
	$result = $oFiles->getFilesMissingFromNode($node_masks);

	//sync missing files
	while($row = $oFiles->db_fetch_array($result))
	{
		$node_mask = $row['node_mask'];

		//find first node, which contains given file
		foreach($hostname_mask_map as $src_hostname => $storage_node_mask)
		{
			if(0 !== $node_mask & $storage_node_mask)
			{
				$full_file_path = CFG_FILE_STORAGE.$row['path'].$row['file_path'].$row['file_name'];
				$dst_hostname = '';

				if($oStorageNodes->syncPhysically($src_hostname, $full_file_path, $dst_hostname, $full_file_path))
				{
					$oFiles->setNodeMask($row['file_id'], $node_mask | $storage_node_mask);
				}
				break;
			}
		}
	}

	$oFiles->db_commit();
}
catch(App_Exception $e)
{
	$oFiles->db_rollback();
	$oLog = new Logger();
	$oLog->logException($e);
	exit(1);
}

exit(0);
