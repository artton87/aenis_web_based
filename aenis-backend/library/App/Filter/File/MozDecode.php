<?php
/**
 * XUL upload fix filter for files
 * @package Framework\Filter
 */

 
/**
 * A decode fix filter for files
 * @package Framework\Filter
 */
class App_Filter_File_MozDecode extends App_Filter_Abstract
{
	/**
	 * File filter implementation
	 * @access public
	 * @param string $value    Path to file to be filtered
	 * @return string    Name of resulting file
	 */
    public function applyFilter($value)
    {
    	$contents = file_get_contents($value);
        $contents = preg_replace("/\+/", "%2B", $contents);
        $handle = fopen($value, 'w');
        fwrite($handle, urldecode($contents));
        fclose($handle);
        return $value;
    }
}
