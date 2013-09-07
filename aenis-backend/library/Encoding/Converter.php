<?php
/**
 * Character maps definition
 * @package arpis-jace\library
 */

/**
 * Character maps definitions
 * @author BestSoft
 * @package arpis-jace\library
 */
class Encoding_Converter
{
	/**
	 * Converts given ARMASCII encoded string to UTF-8
	 * @access protected
	 * @param string $asciiStr    An ARMASCII encoded string
	 * @return string    A UTF-8 encoded string
	 */
	public static function armascii_to_utf8($asciiStr)
	{
		$ret = '';
		$len = strlen($asciiStr);
		for($i=0; $i<$len; ++$i)
		{
			$ch = $asciiStr[$i];
			$ch_ascii_code = ord($ch);
			if(isset(Encoding_Maps::$ARMASCII_UTF8[$ch_ascii_code]))
			{
				$ret .= Encoding_Maps::$ARMASCII_UTF8[$ch_ascii_code];
			}
			else
			{
				$ret .= $ch;
			}
		}
		return $ret;
	}
	
	
	/**
	 * Converts given UTF-8 encoded string to ARMASCII
	 * @access protected
	 * @param string $utf8Str    A UTF-8 encoded string
	 * @return string    An ARMASCII encoded string
	 */
	public static function utf8_to_armascii($utf8Str)
	{
		$ret = '';
		$len = mb_strlen($utf8Str);
		for($i=0; $i<$len; ++$i)
		{
			$ch = mb_substr($utf8Str, $i, 1);
			if(isset(Encoding_Maps::$UTF8_ARMASCII[$ch]))
			{
				$ret .= chr(Encoding_Maps::$UTF8_ARMASCII[$ch]);
			}
			else
			{
				$ret .= $ch;
			}
		}
		return $ret;
	}
}