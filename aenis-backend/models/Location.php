<?php

class Location extends HistoricalTable
{
    
  /**
   * Gets all existing regions
   */
    public function getRegions($lang_id)
    {
        $query = "SELECT regions.code,regions_content.name FROM bs_loc_regions regions
                         LEFT JOIN bs_loc_regions_content regions_content ON regions_content.region_id = regions.id
                         WHERE regions_content.lang_id = '$lang_id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $regions[] = $row;
        }
        return $regions;
    }
    
    
    
    
    
    
    
}
?>
