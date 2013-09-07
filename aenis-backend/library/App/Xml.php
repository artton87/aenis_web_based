<?php
/**
 * XML routines
 * @package Framework\Xml
 */

 
/**
 * Provides utility methods for working with XML
 * @package Framework\Xml
 */
class App_Xml
{
	/**
	 * Converts special characters in string to XML safe entities
	 * @static
	 * @access public
	 * @param string $s   A string
	 * @return string    A prepared string
	 */
	public static function forXML($s)
	{
		$s = htmlspecialchars($s);
		$s = mb_ereg_replace('\r', '&#xD;', $s, 'm');
		$s = mb_ereg_replace('\n', '&#xA;', $s, 'm');
		$s = mb_ereg_replace('\t', '&#x9;', $s, 'm');
	    return $s;
	}
	
	
	/**
	 * Converts given text to proper XHTML code
	 * @static
	 * @access public
	 * @param string $s   A string
	 * @return string    A prepared string
	 */
	public static function forXHTML($s)
	{
		$s = htmlspecialchars($s);
		$s = mb_ereg_replace('[\n|\r\n|]', '<br/>', $s, 'm');
		$s = mb_ereg_replace('\t', '&nbsp;&nbsp;&nbsp;&nbsp;', $s, 'm');
	    return $s;
	}
}
