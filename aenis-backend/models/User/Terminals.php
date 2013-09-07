<?php

class User_Terminals extends App_Db_Table_Abstract
{
    
    
    protected $_table = 'user_terminals';
    
    
    /**
     * Returns user terminal id by user id
     * 
     * @param type $user_id
     * @return type
     */
    public function get_user_terminal($user_id)
    {
        $query = "SELECT * FROM bs_user_terminals WHERE user_id='$user_id'";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $terminal_id[] = $row;
        }
        return $terminal_id[0];
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}
?>
