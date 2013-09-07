<?php
/**
 * Image scaling filter
 * @package Framework\Filter
 */

 
/**
 * An image scaling filter for files
 * @package Framework\Filter
 */
class App_Filter_File_ImageScale extends App_Filter_Abstract
{
	/**
	 * @var integer    Width to scale to
	 */
	protected $_w = null;
	
	/**
	 * @var integer    Height to scale to
	 */
	protected $_h = null;
	
	
	/**
	 * Constructor. Sets scale width and height
	 * @access public
	 * @param integer $w    Width. Default is 128.
	 * @param integer $h    Height. Default is 128.
	 * @return App_Filter_File_ImageScale
	 */
	public function __construct($w = 128, $h = 128)
	{
		$this->setWidth($w);
		$this->setHeight($h);
	}
	
	/**
	 * Sets width to scale to
	 * @access public
	 * @param integer $w    Width
	 */
	public function setWidth($w)
	{
		$this->_w = $w;
	}
	
	/**
	 * Returns width to scale to
	 * @access public
	 * @return integer    Width
	 */
	public function getWidth()
	{
		return $this->_w;
	}
	
	
	/**
	 * Sets height to scale to
	 * @access public
	 * @param integer $h    Height
	 */
	public function setHeight($h)
	{
		$this->_h = $h;
	}
	
	/**
	 * Returns height to scale to
	 * @access public
	 * @return integer    Height
	 */
	public function getHeight()
	{
		return $this->_h;
	}
	
	/**
	 * File filter implementation
	 * @access public
	 * @param string $value    Path to source image
	 */
    public function applyFilter($value)
    {
    	$oImage = new App_File_Image();
    	return $oImage->scaleImage($value, $this->_w, $this->_h);
    }
}
