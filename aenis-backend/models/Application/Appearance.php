<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Bestsoft
 * Date: 6/26/13
 * Time: 12:12 PM
 * To change this template use File | Settings | File Templates.
 */

class Application_Appearance extends App_Db_Table_Abstract
{

    


    protected $_table = 'appearance';

    /**
     * @param $data
     */
    public function getAppearances($app_type,$lang_id)
    {
        $query = "SELECT appearance.key,appearance.doc_type_id,appearance.required,types.doc_type_code,content.label
                  FROM bs_appearance appearance
                  LEFT JOIN bs_document_types types ON types.id=appearance.doc_type_id
                  LEFT JOIN bs_document_types_content content ON content.doc_type_id=types.id
                  WHERE appearance.tr_type_id='$app_type' AND content.lang_id='$lang_id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $return[$row['key']][] = $row;
        }  
        //Logger::logDebugInformation($return);
        return $return;
    }


























}