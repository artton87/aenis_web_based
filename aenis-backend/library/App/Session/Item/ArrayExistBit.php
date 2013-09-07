<?php
/**
 * ArrayExistBit session item definition
 * @package Framework\Session
 */

 
/**
 * A session item class, which holds given value in session, when
 * given key exists in given array and does nothing otherwise.
 * @package Framework\Session
 */
class App_Session_Item_ArrayExistBit extends App_Session_Item_Abstract
{
	/**
	 * Retrieved value, which will be stored in session later
	 * @var integer
	 */
    protected $m_nValue = 0;
    
    /**
    * Initializes value of internal variable
    * @param string $key     Key to look for in given array
    * @param array $array    Optional. An array to search the key within. Default: $_POST
    * @param object|integer $value   Optional. Value to be stored in session if key is found. Default: 1
    */
    public function __construct($key, $array = array(), $value=1)
    {
        if(count($array)==0) $array = &$_POST;
        $this->fromValue($key, $array, $value);
    }
    
    /**
    * Initializes value of internal variable
    * @param string $key     Key to be looked for in the given array
    * @param array $array    An array to search the key within.
    * @param object|integer $value   Optional. Value to be stored in session if key is found. Default: 1
    */
    public function fromValue($key, $array, $value=1)
    {
        if(array_key_exists($key, $array))
        {
            $this->m_nValue = $value;
            $this->m_bReady = true;
        }
        else
        {
            $this->m_nValue = 0;
            $this->m_bReady = false;
        }
    }
    
	/**
	 * Returns retrieved value
	 * @return integer    Retrieved value
	 */
    public function getValue()
    {
        return $this->m_nValue;
    }
}