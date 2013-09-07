<?php
/**
 * Storage nodes synchronization and identification
 * @package Core
 */

/**
 * Methods for storage nodes synchronization and identification.
 * Each storage node belongs to single web server node. Normally, only one storage node
 * is active, the other nodes become active only if the currently active node goes down.
 * @author BestSoft
 * @package Core
 */
class Storage_Nodes extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'storage_nodes';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'storage_nodes';


	/**
	 * Returns bit mask of currently active node
	 * @access public
	 * @return integer    Bit mask for the currently active node
	 */
	public function getCurrentStorageNodeMask()
	{
		$key = gethostname();
		$masks = $this->getStorageNodeMasks();
		if(isset($masks[$key]))
			return $masks[$key];
		return 0;
	}


	/**
	 * Returns array with storage nodes information.
	 * Results are cached, so database calls will not be made when calling this function multiple times.
	 * @access public
	 * @return array
	 */
	public function getStorageNodeMasks()
	{
		$cache_id = 'storage_nodes';
		if(false === ($items = App_Cache()->get($cache_id, true, true)))
		{
			$items = array();
			$result = $this->db_select($this->_table, array());
			while($row = $this->db_fetch_array($result))
			{
				$items[$row['hostname']] = intval($row['mask']);
			}
			App_Cache()->set($cache_id, $items, null, array(self::CACHE_TAG), true);
		}
		return $items;
	}


	/**
	 * Synchronizes the given file across nodes.
	 * File is new here, that is, is just uploaded and should be copied to all nodes.
	 * @access public
	 * @param integer $file_id    Id of file which should be synchronized to other nodes.
	 * @throws App_Exception if sync fails because of system errors
	 */
	public function syncNew($file_id)
	{
		$current_node_mask = $this->getCurrentStorageNodeMask();
		if(0 == $current_node_mask) //storage node is not registered in DB
		{
			return; //it make no sense to continue
		}

		$oFiles = new Files();
		$fi = $oFiles->getById($file_id);
		$current_file_node_mask = $file_node_mask = intval($fi['node_mask']);

		if(0 == $file_node_mask & $current_node_mask) //file does not exist on the current node
		{
			return; //do nothing and return, 'owner' node will do the sync
		}

		$nodes = $this->getStorageNodeMasks();
		foreach($nodes as $hostname => $node_mask)
		{
			if(0 == $file_node_mask & $node_mask) //file does not exist on node
			{
				$full_file_path = CFG_FILE_STORAGE.$fi['path'].$fi['file_path'].$fi['file_name'];
				if(file_exists($full_file_path))
				{
					$return_status = $this->syncPhysically('', $full_file_path, $hostname, $full_file_path);
					if($return_status) //success
					{
						$file_node_mask |= $node_mask;
					}
				}
			}
		}

		if($current_file_node_mask != $file_node_mask)
		{
			$oFiles->setNodeMask($file_id, $file_node_mask);
		}
	}


	/**
	 * Copies file $src from $src_hostname to file $dst at $dst_hostname
	 * @acccess public
	 * @param string $src_hostname    Optional. Source hostname
	 * @param string $src     Full source file path, including file name
	 * @param string $dst_hostname    Optional. Destination hostname
	 * @param string $dst     Full destination file path, including file name
	 * @throws App_Exception when sync fails
	 * @return boolean    True, when everything is ok
	 */
	public function syncPhysically($src_hostname, $src, $dst_hostname, $dst)
	{
		$command = 'scp ';

		if(!empty($src_hostname))
			$command .= "$src_hostname:";

		$command .= $src;

		if(!empty($dst_hostname))
			$command .= "$dst_hostname:";

		$command .= $dst;

		$command = escapeshellcmd($command);
		$output = array();
		$return_status = 1;
		exec($command, $output, $return_status);
		if(0 == $return_status)
		{
			return true;
		}
		else
		{
			throw new App_Exception(
				"The command ($command) failed with error code $return_status while syncing file"
			);
		}
	}
}
