<?php
/**
 * ArrayString session item definition
 * @package Framework\Session
 */

 
/**
 * A session item class, which holds a string identified by the given key in given array.
 * @package Framework\Session
 */
class App_Session_Item_ArrayString extends App_Session_Item_Abstract
{
	/**
	 * Retrieved value, which will be stored in session later
	 * @var string
	 */
    protected $m_sValue = 0;
    
    /**
    * Initializes value of internal variable
    * @param string $key     A key to be seached for in the array
    * @param array $vec    An array to be searched
    */
    public function __construct($key, $vec)
    {
        $this->fromValue($key, $vec);
    }
    
    /**
    * Initializes value of internal variable
    * @param string $key     A key to be seached for in the $_POST array
    * @param array $vec    An array to be searched
    */
    public function fromValue($key, $vec)
    {
        if(array_key_exists($key, $vec))
        {
            $this->m_sValue = urldecode($vec[$key]);
            $this->m_bReady = true;
        }
        else
        {
            $this->m_sValue = '';
            $this->m_bReady = false;
        }
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