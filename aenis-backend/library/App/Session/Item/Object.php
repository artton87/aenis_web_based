<?php
/**
 * Object session item definition
 * @package Framework\Session
 */

 
/**
 * A session item class, which holds 'any' object.
 * Of course, php should be able to store this object into session.
 * That is why in description the word 'any' is used in parenthesis.
 * @package Framework\Session
 */
class App_Session_Item_Object extends App_Session_Item_Abstract
{
	/**
	 * Retrieved value, which will be stored in session later
	 * @var object
	 */
    protected $m_oValue = '';
    
	/**
	 * Constructor
	 * @param mixed $value    A value to be stored in session
	 */
    public function __construct($value)
    {
        $this->fromValue($value);
    }
    
	/**
	 * Sets session item value
	 * @param object $value    A value to be stored in session
	 */
    public function fromValue($value)
    {
        $this->m_oValue = $value;
        $this->m_bReady = true;
    }
    
	/**
	 * Returns retrieved value
	 * @return object    Retrieved value
	 */
    public function getValue()
    {
        return $this->m_oValue;
    }
}
