<?php
/**
 * 
 * @package Framework
 * @subpackage Array
 */

 
/**
 * Provides utility methods for working with array
 * @package Framework
 */
class App_Array
{
	/**
	 * Extracts values of the given keys from the given array $from.
	 * If $from is an object, extracts values of $from properties.
	 * @example
	 *      $picked = App_Array::pick($obj, 'foo', 'bar', 'baz');
	 * 		$picked = App_Array::pick($obj, array('foo', 'bar'), 'baz');
	 * 		$picked = App_Array::pick($vec, 'baz');
	 * 		$picked = App_Array::pick($vec, array('foo', 'bar'));
	 *      $picked = App_Array::pick($vec, array('foo'=>'my_foo', 'bar')); //$picked will contain value of 'foo' in 'my_foo'
	 * @access public
	 * @param array|object $from,...    An array/object to pick values from.
	 * 									Next parameters are keys which should be picked.
	 * 									It is possible to give keys in a single array or as multiple arguments.
	 * @return array    A subset of the initial array $from
	 */
	public static function pick($from)
	{
		if(is_object($from))
			$from = get_object_vars($from);
		else
		{
			$from = is_array($from) ? $from : array($from);
		}

		$data = array();
		$args = array_slice(func_get_args(), 1);
		foreach($args as $arg)
		{
			if(!is_array($arg))
				$arg = array($arg);
			foreach($arg as $key=>$val)
			{
				if(is_numeric($key))
					$data[$val] = $from[$val];
				else
					$data[$val] = $from[$key];
			}
		}
		return $data;
	}


	public static function objectsIntoArray($arrObjData, $arrSkipIndices = array())
	{
		$arrData = array();
	   
		// if input is object, convert into array
		if (is_object($arrObjData)) {
			$arrObjData = get_object_vars($arrObjData);
		}
	   
		if (is_array($arrObjData)) {
			foreach ($arrObjData as $index => $value) {
				if (is_object($value) || is_array($value)) {
					$value = App_Array::objectsIntoArray($value, $arrSkipIndices); // recursive call
				}
				if (in_array($index, $arrSkipIndices)) {
					continue;
				}
				$arrData[$index] = $value;
			}
		}
		return $arrData;
	}
}
