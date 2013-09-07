<?php
/**
 * Image transformations
 * @package Framework\File
 */

 
/**
 * Provides utility methods for working with image files
 * @package Framework\File
 */
class App_File_Image
{
	/**
	 * Thumbnail width
	 * @access protected
	 * @var integer
	 */
	protected $_thumbnailWidth = 128;
	
	/**
	 * Thumbnail height
	 * @access protected
	 * @var integer
	 */
	protected $_thumbnailHeight = 128;
	
	/**
	 * Quality for saving jpeg images. Ranges from 0 (worst, smallest file) to 100 (best, biggest file)
	 * @access protected
	 * @var integer
	 */
	protected $_quality = 75;
	
	
	/**
	 * Sets thumbnail width
	 * @access public
	 * @param integer $w    New width value
	 */
	public function setThumbnailWidth($w)
	{
		$this->_thumbnailWidth = $w;
	}
	
	/**
	 * Returns thumbnail width
	 * @access public
	 * @return integer
	 */
	public function getThumbnailWidth()
	{
		return $this->_thumbnailWidth;
	}
	
	/**
	 * Sets thumbnail height
	 * @access public
	 * @param integer $h    New height value
	 */
	public function setThumbnailHeight($h)
	{
		$this->_thumbnailHeight = $h;
	}
	
	/**
	 * Returns thumbnail height
	 * @access public
	 * @return integer
	 */
	public function getThumbnailHeight()
	{
		return $this->_thumbnailHeight;
	}
	
	/**
	 * Sets quality
	 * @access public
	 * @param integer $q    New quality value
	 */
	public function setQuality($q = 75)
	{
		$this->_quality = $q;
	}
	
	/**
	 * Returns quality
	 * @access public
	 * @return integer
	 */
	public function getQuality()
	{
		return $this->_quality;
	}
	

    /**
     * Generates thumbnail of image at the given path
     * @access public
     * @param string $srcPath    Path to source image
     * @throws Exception on any error
     * @return string    Path to generated thumbnail
     */
    public function generateThumbnail($srcPath)
    {
    	$dstPath = substr($srcPath, 0, strrpos($srcPath, '.')) . '_thumb.jpg';
		list($srcW, $srcH, $srcType) = getimagesize($srcPath);
		$oSrcImage = $this->_createImageResource($srcPath, $srcType);
		
		$thumbH = $this->getThumbnailHeight();
    	$thumbW = $this->getThumbnailWidth();
    	
		if($srcW<$thumbW && $srcH<$thumbH)
		{
			$oDstImage = imagecreatetruecolor($srcW, $srcH);
			imagecopy($oDstImage, $oSrcImage, 0, 0, 0, 0, $srcW, $srcH);
		}
		else
		{
			list($dstW, $dstH) = $this->_getScaledSizes($srcW, $srcH, $thumbW, $thumbH);
			$oDstImage = imagecreatetruecolor($dstW, $dstH);
			imagecopyresampled($oDstImage, $oSrcImage, 0, 0, 0, 0, $dstW, $dstH, $srcW, $srcH);
		}
		imagedestroy($oSrcImage);
		imagejpeg($oDstImage, $dstPath, $this->getQuality());
		imagedestroy($oDstImage);
		return $dstPath;
    }
    
    
    /**
     * Scales image at given path to new width and height
     * @access public
     * @param string $srcPath    Path to source image
     * @param integer $w    Destination width
     * @param integer $h    Destination height
     * @param boolean $bDeleteOriginal    Optional. If true, original image will be deleted
     * @throws Exception on any error
     * @return string    Path to scaled image
     */
    public function scaleImage($srcPath, $w, $h, $bDeleteOriginal = true)
    {
    	$dstPath = substr($srcPath, 0, strrpos($srcPath, '.')) . '.jpg';
    	
		list($srcW, $srcH, $srcType) = getimagesize($srcPath);
		$oSrcImage = $this->_createImageResource($srcPath, $srcType);
		
		if($srcW<$w && $srcH<$h)
		{
			$oDstImage = imagecreatetruecolor($srcW, $srcH);
			imagecopy($oDstImage, $oSrcImage, 0, 0, 0, 0, $srcW, $srcH);
		}
		else
		{
			list($dstW, $dstH) = $this->_getScaledSizes($srcW, $srcH, $w, $h);
			$oDstImage = imagecreatetruecolor($dstW, $dstH);
			imagecopyresampled($oDstImage, $oSrcImage, 0, 0, 0, 0, $dstW, $dstH, $srcW, $srcH);
		}
		
		imagedestroy($oSrcImage);
		if($bDeleteOriginal) @unlink($srcPath);
		
		imagejpeg($oDstImage, $dstPath, $this->getQuality());
		imagedestroy($oDstImage);
		
		return $dstPath;
    }
    
    
    /**
     * Cuts out part of image at given path to new width and height
     * @access public
     * @param string $srcPath    Path to source image
     * @param integer $cropX    Crop area left coordinate - X
     * @param integer $cropY    Crop area top coordinate - Y
     * @param integer $cropW    Crop area width
     * @param integer $cropH    Crop area height
     * @param boolean $bDeleteOriginal    Optional. If true, original image will be deleted
     * @throws Exception on any error
     * @return string    Path to scaled image
     */
    public function cropImage($srcPath, $cropX, $cropY, $cropW, $cropH, $bDeleteOriginal = true)
    {
		$dstPath = substr($srcPath, 0, strrpos($srcPath, '.')) . 'c.png';
    	
		list($srcW, $srcH, $srcType) = getimagesize($srcPath);
		$oSrcImage = $this->_createImageResource($srcPath, $srcType);
		
		$oDstImage = imagecreatetruecolor($cropW, $cropH);
	    imagealphablending($oDstImage, false);
	    imagecopy($oDstImage, $oSrcImage, 0, 0, $cropX, $cropY, $cropW, $cropH);
	    imagedestroy($oSrcImage);
	    if($bDeleteOriginal) @unlink($srcPath);
	    imagesavealpha($oDstImage, true);
	    imagepng($oDstImage, $dstPath, 9);
	    imagedestroy($oDstImage);
	    
	    return $dstPath;
    }
    
    
    /**
     * Returns image resource for use with PHP image functions
     * @access public
     * @param string $imagePath    Path to image
     * @param integer $imageType    One of IMAGETYPE_XXX constants
     * @throws App_Exception on any error
     * @return resource
     */
    protected function _createImageResource($imagePath, $imageType)
    {
    	$oImage = null;
		switch($imageType)
		{
			case IMAGETYPE_JPEG:
				$oImage = imagecreatefromjpeg($imagePath);
				break;
			case IMAGETYPE_GIF:
				$oImage = imagecreatefromgif($imagePath);
				break;
			case IMAGETYPE_PNG:
				$oImage = imagecreatefrompng($imagePath);
				break;
			default:
				throw new App_Exception('Unsupported image format');
		}
		return $oImage;
    }
    
    
    /**
	 * Returns new sizes, scaled to given max width and height
	 * 
	 * @param integer $srcW    Source width
	 * @param integer $srcH    Source height
	 * @param integer $maxW    Maximal destination width
	 * @param integer $maxH    Maximal destination height
	 * @return array    First element is destination width, second is destination height
	 */
	protected function _getScaledSizes($srcW, $srcH, $maxW, $maxH)
	{
		$dstW = $srcW;
		$dstH = $srcH;
		$ratio = $srcH / $srcW;
		
		if($dstW>$maxW)
		{
			$dstW = $maxW;
			$dstH = (int)floor($dstW * $ratio);
		}
		if($dstH>$maxH)
		{
			$dstH = $maxH;
			$dstW = (int)floor($dstH / $ratio);
		}
		
		return array($dstW, $dstH);
	}
}
