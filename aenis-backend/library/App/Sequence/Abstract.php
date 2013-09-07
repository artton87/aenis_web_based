<?php
/**
 * Abstract sequence definition
 * @package Framework\Sequence
 */

 
/**
 * A parent class for all sequence classes. Sequence is like array with methods for element adding and removal
 * @package Framework\Sequence
 * @abstract
 */
abstract class App_Sequence_Abstract
{
	/**
	 * @var array    Sequence items
	 */
    protected $_items = array();
    
    
	/**
     * Adds item to this sequence
     * @param array|mixed $items    One or more items
     */
    public function add($items)
    {
		if(!is_array($items))
			$items = array($items);
		foreach($items as $item)
			$this->_items[] = $item;
    }
    
    /**
     * Returns all items of this sequence
     * @return array
     */
    public function getAll()
    {
        return $this->_items;
    }
    
    /**
     * Removes all items from this sequence
     */
    public function removeAll()
    {
		$this->_items = array();
    }
    
    
    /**
     * Rusn sequence items on given object
     * @abstract
     * @access public
     * @param mixed $object
     */
    abstract public function run($object);
}
