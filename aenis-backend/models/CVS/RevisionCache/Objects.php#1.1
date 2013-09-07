<?php

class Objects extends App_Db_Table_Abstract
{
    const OBJECT_TYPE_VEHICLE = 2;
    const OBJECT_TYPE_ESTATE = 3;
   const E_POLICE_URL = 'http://police.e-register.am/ext/web-service/';
   const E_CADASTRE_URL = 'http://10.0.21.31/arpis_bs/php/api/?method=textual.unit.aenis&api_key=BCT8L3Q643TCRMT4DORS8LTCPVB7KBZH&format=xml';
   protected $_table = 'objects';



    public function getTransportDetails($pre, $code, $post,$vin = null)
    {
        $header =  array("Content-type: text/xml\r\n");
        if($vin != null)
        {

            $xml_request = '<?xml version="1.0" encoding="UTF-8" ?>
                               <epolice>
                             <request action="info" subject="vehicle" id="4">
                              <vehicle vin="'.$vin.'" />
                             </request>
                            </epolice>';
        }
        else
        {
            $xml_request = '<?xml version="1.0" encoding="UTF-8" ?>
    			<epolice>
					<request action="info" subject="vehicle" id="4">
						<vehicle pre="'.$pre.'" code="'.$code.'" post="'.$post.'"/>
					</request>
				</epolice>';

        }

		/*
		    <?xml version="1.0" encoding="UTF-8" ?>
			<epolice>
				<response subject="vehicle" action="info" id="4" status="failed">
					<vehicle pre="17" code="LL" post="017" vehicle_group="">
						<message>No vehicle found</message>
					</vehicle>
				</response>
			</epolice>
		 */
        $url = self::E_POLICE_URL;
        $response_xml = Curl::curl_post($url, $xml_request, $header);
        $response_xml = trim($response_xml);
        $xmlObj = simplexml_load_string($response_xml);


        $status = (string)$xmlObj->response[0]['status'];
		if($status != 'ok') return null;
		return App_Array::objectsIntoArray($xmlObj);
    }

    /**
     * Get objects
	 * @TODO remove Objects::getObjects method and replace it with Transaction_Relationship_Objects::getObjects
     * @param array $search     Associative array containing filtering information
     * @param bool $return_count     Bit to switch between returning records / count of records
     * @return mixed
     */
    public function getObjects($search = array(), $return_count = FALSE)
    {
		/*
        $oLanguages = new Languages();
        $default_lang_id = $oLanguages->getDefaultLanguage()->id;
        $where = array(
            'objects.is_deleted = 0',
            'objects_dt.is_last =1'
        );
        if(!empty($search['rel_id']))
        {
            $where[] = 'objects.rel_id = '.$search['rel_id'];
        }
        if(!$return_count)
        {
            $select = '
             inner_j.*,
                    (
                    SELECT CONCAT(storag.path, files.file_path, files.file_name) ';
            /*objects.id,
            objects.rel_dt_id,
            object_types.code,
            object_types.label AS type_label,
            (SELECT object_dt_properties.value  FROM bs_object_dt_properties object_dt_properties
                 WHERE object_dt_properties.code = "id" AND object_dt_properties.object_dt_id = objects_dt.id) AS object_id,
              (SELECT object_dt_properties.value  FROM bs_object_dt_properties object_dt_properties
                      WHERE object_dt_properties.code = "data" AND object_dt_properties.object_dt_id = objects_dt.id) AS object_data';*/
        /*}
        else
        {
            $select = 'COUNT(*) AS count';
        }

        $where = empty($where) ? '' : 'WHERE '.implode(' AND ', array_unique($where));

        $query = "SELECT $select
                    FROM bs_documents_dt documents_dt
                    LEFT JOIN bs_document_files document_files ON document_files.doc_dt_id = documents_dt.id
                    LEFT JOIN bs_files files ON files.id = document_files.file_id
                    LEFT JOIN bs_storage storag ON storag.id = files.storage_id
                    WHERE documents_dt.is_last =1 AND documents_dt.doc_id = inner_j.document_id
                    ) AS full_file_path
                     FROM (
                         SELECT objects.id, objects.rel_id, object_types.code, object_types.label AS type_label,
                         (
							 SELECT object_properties.value
							 FROM bs_object_properties object_properties
							 WHERE object_properties.code = 'id' AND object_properties.object_id = objects.id
					     ) AS object_id,
						 (
							 SELECT object_properties.value
							 FROM bs_object_properties object_properties
							 WHERE object_properties.code = 'data' AND object_properties.object_id = objects.id
						 ) AS object_data,
                    (SELECT id FROM bs_documents documents WHERE documents.rel_id = objects.rel_id AND documents.is_deleted =0  ) AS document_id
                    FROM bs_objects objects
                    LEFT JOIN bs_object_types object_types ON object_types.id = objects.obj_type_id
                    $where
                    )inner_j
			ORDER BY inner_j.object_id DESC
		";
        return $this->db_query($query);*/
    }

    /**
     * get realty details
     * @param $certificate_number
     * @return array|null
     */
    public function getRealtyDetails($certificate_number)
    {
        $url = self::E_CADASTRE_URL;
        $url .= '&crtnum='.$certificate_number;
        $response_xml = file_get_contents($url);
        $response_xml = trim($response_xml);
        $xmlObj = simplexml_load_string($response_xml);
        $success = $xmlObj->success;
        if($success != 1) return null;
        return App_Array::objectsIntoArray($xmlObj);
    }
}
