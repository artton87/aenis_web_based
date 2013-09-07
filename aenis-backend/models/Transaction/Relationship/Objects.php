<?php
/**
 * Transaction objects management
 * @package aenis
 */

/**
 * Contains methods for transaction objects management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Relationship_Objects extends HistoricalTable
{
	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'objects';


	/**
	 * Returns property value of the given object
	 * @access public
	 * @param integer $object_id    Id of object
	 * @param string $property_code    Object property code
	 * @return string|null    Value of object property
	 */
	public function getObjectPropertyValue($object_id, $property_code)
	{
		$q = "SELECT
            	object_properties.value
            FROM bs_objects objects
            JOIN bs_object_properties object_properties ON object_properties.object_id = objects.id
            WHERE object_properties.transaction_property_type_id=(
                    SELECT
                    transaction_property_types.id
                    FROM bs_transaction_property_types transaction_property_types
                    WHERE transaction_property_types.code = '".$this->db_escape_string($property_code)."'
                    )
            	  AND objects.id = '".intval($object_id)."' AND objects.new_id IS NULL AND objects.del_user_id IS NULL
        ";
		if($row = $this->db_fetch_row($this->db_query($q)))
		{
			return $row[0];
		}
		return null;
	}


	/**
	 * Returns objects
	 * @access public
	 * @param array $search    Optional. Array with the following search criteria:
	 * 						   object_id, object_type_code, relationship_id, transaction_id
	 * @param array $properties    Optional. Which properties to return from object_properties table
	 * @return mysqli_result
	 */
	public function getObjects($search = array(), $properties = array())
	{
		$where = array();
		$joins = array();

		if(empty($search['object_id']))
		{
			$where[] = 'objects.del_user_id IS NULL';
			$where[] = 'objects.new_id IS NULL';
		}
		else
		{
			$where[] = "objects.id = '".intval($search['object_id'])."'";
		}

		if(!empty($search['object_type_code']))
			$where[] = "object_types.code = '".$this->db_escape_string($search['object_type_code'])."'";

		if(!empty($search['relationship_id']))
		{
			$where[] = "rel.id = '".intval($search['relationship_id'])."'";
			$joins[] = 'JOIN bs_relationships rel ON rel.id = objects.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL';
		}

		if(!empty($search['transaction_id']))
		{
			$where[] = "tr.id = '".intval($search['transaction_id'])."'";
			$joins[] = 'JOIN bs_relationships rel ON rel.id = objects.rel_id AND rel.del_user_id IS NULL AND rel.new_id IS NULL';
			$joins[] = 'JOIN bs_transactions tr ON tr.id = rel.tr_id AND tr.del_user_id IS NULL AND tr.new_id IS NULL';
		}

		$where = implode(' AND ', $where);
		$joins = implode(PHP_EOL, array_unique($joins));

		$object_properties = array();
		foreach($properties as $code=>$property)
		{
			$object_properties[] = "(
				SELECT
					object_properties.value
				FROM bs_object_properties object_properties
                WHERE object_properties.transaction_property_type_id=(
                    SELECT
                    transaction_property_types.id
                    FROM bs_transaction_property_types transaction_property_types
                    WHERE transaction_property_types.code = '".$this->db_escape_string($code)."'
                    )
                    AND object_properties.object_id = objects.id
			) AS ".$property;
		}
		$object_properties = empty($object_properties) ? '' : implode(','.PHP_EOL, $object_properties).','.PHP_EOL;

        if(!empty($search['vin']))
            $propertyWhere[] = ' AND tmp.vin = "'.$this->db_escape_string($search['vin']).'"';

        if(!empty($search['vehicle_number']))
            $propertyWhere[] = ' AND tmp.vehicle_number = "'.$this->db_escape_string($search['vehicle_number']).'"';

        if(!empty($search['data']))
            $propertyWhere[] = ' AND tmp.object_data = "'.$this->db_escape_string($search['object_data']).'"';

        if(!empty($propertyWhere))
            $propertyWhere = implode(' OR ', $propertyWhere);

		$q = "SELECT tmp.* FROM
              (
                  SELECT
                    objects.*,
                    $object_properties
                    object_types_content.label AS object_type_label,
                    object_types.code AS object_type_code
                FROM bs_{$this->_table} objects
                LEFT JOIN bs_object_types object_types ON object_types.id = objects.obj_type_id
                LEFT JOIN bs_object_types_content object_types_content ON object_types.id = object_types_content.object_type_id
                $joins
                WHERE $where
              ) tmp
             WHERE 1=1 $propertyWhere
        ";
		return $this->db_query($q);
	}


	/**
	 * Add new object
	 * @access public
	 * @param array $data     Associative array with 'objects' database table field values
	 * @return integer    Id of newly inserted record
	 */
    public function addObjectPortal($data) // ??? change
    {
        $object_type = $data['object_type_id'];
        $insert_data = array(
            'rel_id' => $data['rel_id'],
            'obj_type_id' => array('value'=>$object_type, 'escape' => false)
        );
        $object_id = $this->insertUsingAdjacencyListModel($insert_data);
        /*$oObjectProperties = new Transaction_Relationship_Object_Properties();
        $doc_type = $data['doc_type'];
        $query = "SELECT * FROM bs_document_types WHERE doc_type_code='$doc_type'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $return[] = $row;
        }
        $label = $return[0]['label'];
        $oObjectProperties->addProperty($object_id, '27', $label);*/
        return $object_id;
    }

	public function addObject($data, $objectData)
	{
        Logger::logDebugInformation($objectData);
		$object_type = $data['object_type'];
		$insert_data = array(
			'rel_id' => $data['rel_id'],
			'obj_type_id' => array('value'=>"getObjectTypeIdByCode('".$object_type."')", 'escape' => false)
		);
		$object_id = $this->insertUsingAdjacencyListModel($insert_data);

		$separate_properties = array();
		if($object_type == 'vehicle')
		{
			$separate_properties = array(
				'vin' => 'vin',
				'number' => 'vehicle_number'
			);
		}
		elseif($object_type == 'realty')
		{
			$separate_properties = array(
				'certificate_number' => 'registration_number'
			);
		}
		elseif($object_type == 'share')
		{
			//@TODO Add properties for share
		}
		elseif($object_type == 'stock')
		{
			//@TODO Add properties for stock
		}
		elseif($object_type == 'other')
		{
			$separate_properties = array(
				'name' => 'other_description'
			);
		}

		$oObjectProperties = new Transaction_Relationship_Object_Properties();
		foreach($separate_properties as $object_data_key=>$property_type_code)
		{
			$oObjectProperties->addProperty($object_id, $property_type_code, $objectData[$object_data_key]);
			unset($objectData[$object_data_key]);
		}
		if(!empty($objectData))
			$oObjectProperties->addProperty($object_id, 'data', $objectData);

		return $object_id;
	}


	/**
	 * Handles files uploaded for this object
	 * @access public
	 * @param integer $object_id   Object id
	 * @param integer $case_id    Case id to be passed to addDocument
	 * @param array $existing_files    Array with information about existing files (doc_type_id and file_id)
	 * @param object $info    Uploaded files info
	 */
	public function handleObjectUploadedFiles($object_id, $case_id, $existing_files, $info)
	{
		$oDoc = new Documents();
		$oDocFiles = new Document_Files();
		foreach($existing_files as $existing_file)
		{
			$doc_dt_id = $oDoc->addDocument(array(
				'object_id' => $object_id,
				'doc_type_id' => $existing_file['doc_type_id'],
				'case_id' => $case_id,
                'insert_type' =>1
			))->dt_id;
			$oDocFiles->addDocumentFile($doc_dt_id, $existing_file['file_id']);
		}

		$files_backup = $_FILES;
		$_FILES = $info->files;
		foreach($_FILES as $key=>$file)
		{
			$doc_dt_id = $oDoc->addDocument(array(
				'object_id' => $object_id,
				'doc_type_id' => $info->fileKey_docTypeId_map[$key],
				'case_id' => $case_id,
                'insert_type' =>1
			))->dt_id;
            $result = $this->db_select('cases',array('case_code'), array('id'=>$case_id));
            if($row = $this->db_fetch_row($result))
            {
                $case_code = $row[0];
            }
            $oDocFiles->insert($doc_dt_id, array($key=>$file), $case_code);
		}
		$_FILES = $files_backup;
	}


	/**
	 * Add new object data property
	 * @TODO  Replace with Transaction_Relationship_Object_Properties::addObject or, if it is not sufficient, with Transaction_Relationship_Object_Properties::addProperty
	 * @TODO  Remove this method completely
	 * @access public
	 * @param array $data     Associative array with 'bs_object_properties' database table field values
	 * @return integer    Id of newly added record
	 */
	public function addObjectProperty($data)
	{
		$this->db_insert('object_properties', array(
			'object_id' => $data['object_id'],
			'code' => $data['code'],
			'value' => $data['value'],
			'type' => $data['type']
		));
		return $this->db_insert_id();
	}
}
