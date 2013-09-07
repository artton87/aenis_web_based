<?php
/**
 * GetString session item definition
 * @package Framework\Session
 */

 
/**
 * A session item class, which holds a string identified by the given key in $_GET global array.
 * @package Framework\Session
 */
class App_Session_Item_GetString extends App_Session_Item_ArrayString
{
    /**
    * Initializes value of internal variable
    * @param string $key     A key to be seached for in the $_POST array
    */
    public function __construct($key)
    {
        parent::__construct($key, $_GET);
    }
    
    /**
    * Initializes value of internal variable
    * @param string $key     A key to be seached for in the $_GET array
    */
    public function fromValue($key)
    {
        parent::fromValue($key, $_GET);
    }
}