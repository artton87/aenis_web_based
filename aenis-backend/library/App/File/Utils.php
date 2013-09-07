<?php
/**
 * Utility methods for working with files
 * @package Framework\File
 */

 
/**
 * Provides utility methods for working with files
 * @package Framework\File
 */
class App_File_Utils
{
	/**
	 * Helper function. Returns numeric number of bytes
	 * @access public
	 * @static
	 * @param string $size_str    A size as string, for example, 5M
	 * @return integer    Number of bytes
	 */
	public static function size2bytes($size_str)
	{
		switch(substr($size_str, -1))
		{
			case 'K': case 'k': return ((int)$size_str) << 10;
			case 'M': case 'm': return ((int)$size_str) << 20;
			case 'G': case 'g': return ((int)$size_str) << 30;
		}
		return (int)$size_str;
	}


	/**
	 * Gets maximal allowed file size from php.ini.
	 * 'post_max_size' and 'upload_max_filesize' are examined.
	 * @access public
	 * @static
	 * @param float $post_max_size_ratio    Optional. A ratio from (0; 1] range to apply on post_max_size. Defaults to 1
	 * @return integer    Maximal allowed file size in bytes
	 */
	public static function get_upload_max_file_size_setting($post_max_size_ratio = 1.0)
	{
		$post_max_size = intval(self::size2bytes(ini_get('post_max_size')));
		$upload_max_file_size = intval(self::size2bytes(ini_get('upload_max_filesize')));
		return min(
			(int)($post_max_size * $post_max_size_ratio),
			$upload_max_file_size
		);
	}


	/**
	 * Checks whenever file at $file_path is of $type type
	 * @access public
	 * @static
	 * @param string $type    File type
	 * @param string $file_path    Full path to file
	 * @return boolean
	 */
	public static function check_type($type, $file_path)
	{
		$type = strtolower($type);
		if('pdf' == $type)
		{
			$signature = "\x25\x50\x44\x46\x2D";
			return (file_get_contents($file_path, false, null, 0, strlen($signature)) === $signature) ? true : false;
		}
		trigger_error(__CLASS__.'::'.__METHOD__."(). No checking algorithm defined for $type type. Do not use this validator for this type.", E_USER_WARNING);
		return true;
	}
}
