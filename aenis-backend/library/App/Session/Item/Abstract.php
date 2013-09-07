<?php
/**
 * Abstract session item definition
 * @package Framework\Session
 */

 
/**
* An abstract class for all session item classes
* @package Framework\Session
*/
abstract class App_Session_Item_Abstract
{
    /**
    * A ready state flag. If true, one can get value of this session item
    * using getValue() method. Derived classes should set this flag to true,
    * to indicate, that the value of item is ready and can be retrieved.
    */
    protected $m_bReady = false;
    
    /**
    * Return current value of ready state flag
    */
    public function isReady() {return $this->m_bReady;}
    
    /**
    * An abstract method, which returns value of this session item.
    * @access public
    * @return mixed   A session item value
    */
    abstract public function getValue();
}