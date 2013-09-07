<?php
/**
 * PostString session item definition
 * @package Framework\Session
 */

 
/**
 * A session item class, which holds a string identified by the given key in $_POST global array.
 * @package Framework\Session
 */
class App_Session_Item_PostString extends App_Session_Item_ArrayString
{
    /**
     * Initializes value of internal variable
     * @param string $key     A key to be seached for in the $_POST array
     */
    public function __construct($key)
    {
        $this->fromValue($key);
    }
    
    /**
     * Initializes value of internal variable
     * @param string $key     A key to be seached for in the $_POST array
     */
    public function fromValue($key)
    {
        parent::fromValue($key, $_POST);
        if($this->m_bReady)
            $this->m_sValue = urldecode($this->m_sValue);
    }
    
	/**
	 * Returns retrieved value
	 * @return string    Retrieved value
	 */
    public function getValue()
    {
        return $this->m_sValue;
    }
}