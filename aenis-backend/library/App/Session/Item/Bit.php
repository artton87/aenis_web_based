<?php
/**
 * Bit session item definition
 * @package Framework\Session
 */

 
/**
 * A session item class, which holds 0 or given value in session,
 * when given object is empty or not, correspondingly. 'Empty' is
 * checked using php function empty()
 * @package Framework\Session
 */
class App_Session_Item_Bit extends App_Session_Item_Abstract
{
	/**
	 * Retrieved value, which will be stored in session later
	 * @var integer
	 */
    protected $m_nValue = 0;
    
    /**
    * Initializes value of internal variable
    * @param string $obj     An object to be examined
    * @param object $value   Optional. Value to be stored in session if key is found. Default: 1
    */
    public function __construct($obj, $value)
    {
        $this->fromValue($obj);
    }
    
    /**
    * Initializes value of internal variable
    * @param string $obj     An object to be examined
    * @param object|integer $value   Optional. Value to be stored in session if key is found. Default: 1
    */
    public function fromValue($obj, $value=1)
    {
        $this->m_nValue = empty($obj) ? 0 : $value;
        $this->m_bReady = true;
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
