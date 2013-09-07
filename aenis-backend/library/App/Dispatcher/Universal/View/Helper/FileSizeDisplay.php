<?php
/**
 * FileSizeDisplay view helper definition
 * @package Framework\Dispatcher
 */

 
/**
 * Helper for constructing string representation of file size ("120 Kb", for example).
 * You can use view's App_Translate to translate units. Translatable units are 'B', 'KB', 'MB', 'GB'.
 * @package Framework\Dispatcher
 */
class App_Dispatcher_Universal_View_Helper_FileSizeDisplay extends App_Dispatcher_Universal_View_Helper_Abstract
{
	/**
	 * @var string    Constructed string stored here
	 */
	protected $_display_size = null;
	
	/**
	 * @var array    Unit strings
	 */
	private $_units = array('B', 'KB', 'MB', 'GB', 'TB');
	
	
	/**
	 * Helper entry point. Returns string representation of file size ("120 Kb", for example)
	 * @access public
	 * @param array|string $params    If string, $params denotes full path to file, precision=2,
	 * 								  If array - 'full_file_path' key denotes full path to file, 'precision' denotes precision.
	 * @return App_Dispatcher_Universal_View_Helper_FileSizeDisplay
	 */
	public function FileSizeDisplay($params)
	{
		if(is_string($params))
		{
			$full_file_path = $params;
			$precision = 2;
		}
		else
		{
			$full_file_path = $params['full_file_path'];
			$precision = $params['precision'];
		}
		
		$nSizeInBytes = @filesize($full_file_path);
		if($nSizeInBytes === FALSE)
		{
			$this->_display_size = '';
		}
		else
		{
			$bytes = max($nSizeInBytes, 0); 
		    $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
		    $pow = min($pow, count($this->_units) - 1); 
		   
		    $bytes /= pow(1024, $pow);
		    
			$display_units = $this->_view->translate($this->_units[$pow]);
		   
		    $this->_display_size = round($bytes, $precision) . ' ' . $display_units;
		}
		return $this;
	}
	
	
	/**
	 * Returns constructed string
	 * @access public
	 */
	public function __toString()
	{
		return $this->_display_size;
	}
}