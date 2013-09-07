<?php
/**
 * Files management
 * @package Core
 */

/**
 * Methods for working with attached files
 * @author BestSoft
 * @package Core
 */
class Files extends App_Db_Table_Abstract
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'files';


	/**
	 * Returns attached file info as associative array
	 * @access public
	 * @param integer $file_id    File ID
	 * @return mysqli_result
	 */
	public function getById($file_id)
	{
		$q = "SELECT
				files.id AS file_id,
				files.file_path,
				files.file_name,
				files.node_mask,
				storage.path
			FROM bs_{$this->_table} files
			JOIN bs_storage storage ON storage.id = files.storage_id
			WHERE files.id = ".intval($file_id)."
		";

		$result = $this->db_query($q);
		return $this->db_fetch_array($result);
	}

    public function getFile($file_id)
    {
        $query = "SELECT files.file_name,files.file_path,files.storage_id,storage.path FROM bs_files AS files
                  LEFT JOIN bs_storage storage ON storage.id = files.storage_id
                  WHERE files.id = '$file_id' LIMIT 1
                 ";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $return[] = $row;
        }
        return $return[0];
    }
	/**
	 * Returns list of attached files, which do not have the given node masks.
	 * If $node_mask is array, query will use index and will perform faster.
	 * If $node_mask is integer, bitwise AND will be done to determine if file is missing from node.
	 * This will not use index and will perform slower.
	 * @access public
	 * @param array|integer $node_mask    An array of node masks, or a single node mask
	 * @return mysqli_result
	 */
	public function getFilesMissingFromNode($node_mask)
	{
		if(is_array($node_mask))
		{
			$condition = "(files.node_mask NOT IN (".implode(',', $node_mask)."))";
		}
		else
		{
			$condition = "(0 = (files.node_mask & ".intval($node_mask).'))';
		}
		$q = "SELECT
				files.id AS file_id,
				files.file_path,
				files.file_name,
				files.node_mask,
				storage.path
			FROM bs_{$this->_table} files
			JOIN bs_storage storage ON storage.id = files.storage_id
			WHERE $condition
		";
		return $this->db_query($q);
	}
	
	
	/**
	 * Add new file into database
	 * @access public
	 * @param string $file_name    File name
	 * @param string $file_path    File path
	 * @param integer $storage_id    Storage id
	 * @return integer    ID of newly created file
	 */
	public function insert($file_name, $file_path, $storage_id)
	{
		$oNodes = new Storage_Nodes();
		$data = array(
			'file_name' => $file_name,
			'file_path' => $file_path,
			'storage_id' => $storage_id,
			'node_mask' => $oNodes->getCurrentStorageNodeMask()
		);
		$this->db_insert($this->_table, $data);
		$file_id = $this->db_insert_id();

		$oNodes->syncNew($file_id);
		return $file_id;
	}


	/**
	 * Applies given node mask to the given file
	 * @access public
	 * @param integer $file_id    File id
	 * @param integer $file_node_mask    Node mask to set
	 */
	public function setNodeMask($file_id, $file_node_mask)
	{
		$this->db_update($this->_table, array('node_mask'=>$file_node_mask), array('file_id'=>$file_id));
	}
	
	
	/**
	 * Removes given file from database
	 * @access public
	 * @param string $file_id    File ID
	 * @param App_File_Transaction $oFileTransaction    Optional. A file transaction object
	 * @throws App_Db_Exception_Table if file removal fails
	 */
	public function delete($file_id, $oFileTransaction=null)
	{
    	if($row = $this->getById($file_id))
    	{
    		$full_file_path = CFG_FILE_STORAGE.$row['path'].$row['file_path'].$row['file_name'];
    		if(file_exists($full_file_path))
    		{
    			if($oFileTransaction)
    			{
					$res = $oFileTransaction->deleteFile($full_file_path);
    			}
    			else
    			{
					$res = @unlink($full_file_path);
    			}
				if(FALSE === $res)
					throw new App_Db_Exception_Table('Error while removing file. File ID='.$file_id);
			}
    	}
    	$this->db_delete($this->_table, array('id'=>$file_id));
	}
}
