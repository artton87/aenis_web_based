<?php
/**
 * Image based captcha implementation
 * @package Framework\Security
 */

 
/**
 * Contains image based captcha implementation and validation
 * @package Framework\Security
 */
class App_Captcha extends App_Validate_Abstract
{
	/**
     * @var array Character sets
     */
    protected static $D = array('1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','K','L','M','N','P','Q','R','S','T','U','V','X','Y','Z');
	
	/**
     * Generated word
     * @access protected
     * @var string
     */
    protected $_word;
	
	/**
     * Length of the word to generate
     * @access protected
     * @var integer
     */
    protected $_wordlen = 5;
	
	/**
     * Image width
     * @access protected
     * @var integer
     */
    protected $_width = 110;

    /**
     * Image height
     * @access protected
     * @var integer
     */
    protected $_height = 50;

    /**
     * Font size
     * @access protected
     * @var integer
     */
    protected $_fsize = 24;

    /**
     * Image font file
     * @access protected
     * @var string
     */
    protected $_font;
	
	/**
     * Session namespace
     * @access protected
     * @var App_Session_Namespace
     */
    protected $_sessionNamespace;
	
	
    /**
     * Constructor
     * @access public
     * @param App_Session_Namespace $session
     * @return App_Captcha
     */
    public function __construct(App_Session_Namespace $session=null)
    {
        $this->setSessionNamespace($session);
    }
	
	
	/**
	 * Sets character set for captcha generation
	 * @static
	 * @access public
	 * @param array $chars    An array of characters, which can be used in captcha
	 */
	public static function setChars($chars)
	{
		self::$D = $chars;
	}
	
    
    /**
     * Get session object
     * @access public
     * @return App_Session_Namespace
     */
    public function getSessionNamespace()
    {
        return $this->_sessionNamespace;
    }

    /**
     * Set session namespace object
     * @access public
     * @param  App_Session_Namespace $session
     * @return App_Captcha
     */
    public function setSessionNamespace(App_Session_Namespace $session) 
    {
        $this->_sessionNamespace = $session;
        return $this;
    }
    
	
	/**
     * Retrieve word length to use when genrating captcha
     * @access public
	 * @return integer
	 */
    public function getWordlen() 
    {
		return $this->_wordlen;
	}
	
	/**
     * Set word length of captcha
     * @access public
	 * @param integer $wordlen    Word length
     * @return App_Captcha
	 */
    public function setWordlen($wordlen) 
    {
		$this->_wordlen = $wordlen;
		return $this;
	}
	
	
	/**
     * Get font to use when generating captcha
     * @access public
	 * @return string    Font name which is used for captcha generation
	 */
    public function getFont() 
    {
		return $this->_font;
	}
	
	/**
     * Get font size
     * @access public
	 * @return integer    Font size
	 */
    public function getFontSize() 
    {
		return $this->_fsize;
	}
	
	/**
     * Get captcha image height
     * @access public
	 * @return integer    Captcha image height
	 */
    public function getHeight() 
    {
		return $this->_height;
	}
	
	/**
     * Get captcha image width
     * @access public
	 * @return integer    Captcha image width
	 */
    public function getWidth() 
    {
		return $this->_width;
	}
	
	/**
     * Set captcha font
     * @access public
	 * @param string $font    Font path
	 * @return App_Captcha
	 */
    public function setFont($font) 
    {
		$this->_font = $font;
		return $this;
	}
	
	/**
     * Set captcha font size
     * @access public
	 * @param integer $fsize    Font size
	 * @return App_Captcha
	 */
    public function setFontSize($fsize) 
    {
		$this->_fsize = $fsize;
		return $this;
	}
	
	/**
     * Set captcha image height
     * @access public
	 * @param integer $height    Captcha image height
	 * @return App_Captcha
	 */
    public function setHeight($height) 
    {
		$this->_height = $height;
		return $this;
	}
	
	/**
     * Set captcha image width
     * @access public
	 * @param integer $width    Captcha image width
	 * @return App_Captcha
	 */
    public function setWidth($width) 
    {
		$this->_width = $width;
		return $this;
	}
    
    /**
     * Generate random frequency
     * @access protected
     * @return float
     */
    protected function _randomFreq() 
    {
	    return mt_rand(700000, 1000000) / 15000000;
    }

    /**
     * Generate random phase
     * @access protected
     * @return float
     */
    protected function _randomPhase() 
    {
        // random phase from 0 to pi
	    return mt_rand(0, 3141592) / 1000000;
    }

    /**
     * Generate random character size
     * @access protected
     * @return int
     */
    protected function _randomSize() 
    {
	    return mt_rand(300, 700) / 100;
    }
	
	
	/**
     * Get captcha word
     * @access public
     * @return string
     */
    public function getWord()
    {
        if(empty($this->_word))
        {
            $this->_word = $this->getSessionNamespace()->word;
        }
        return $this->_word;
    }

    /**
     * Set captcha word
     * @access protected
     * @param string $word    A word to set
     * @return App_Captcha
     */
    protected function _setWord($word)
    {
        $this->getSessionNamespace()->word = $word;
        $this->_word = $word;
        return $this;
    }
	
	
	/**
     * Generate new random word
     * @access protected
     * @return string    Generated word
     */
    protected function _generateWord()
    {
        $word    = '';
        $wordLen = $this->getWordLen();
        $digits  = self::$D;

        for ($i=0; $i < $wordLen; $i++) {
            $word .= $digits[array_rand($digits)];
        }

        if (strlen($word) > $wordLen) {
            $word = substr($word, 0, $wordLen);
        }

        return $word;
    }
	
	/**
     * Generate new word and save it to session
     * @access public
     */
    public function generate()
    {
        $this->_setWord($this->_generateWord());
    }
    
    
    /**
     * Generate image and send it back to browser
     * @access public
     */
    public function sendImageResponse()
    {
        if (!extension_loaded('gd')) {
            throw new App_Exception('Image CAPTCHA requires GD extension');
        }

        if (!function_exists('imagepng')) {
            throw new App_Exception('Image CAPTCHA requires PNG support');
        }

        if (!function_exists('imageftbbox')) {
            throw new App_Exception('Image CAPTCHA requires FT fonts support');
        }

        $font = $this->getFont();

        if (empty($font)) {
            throw new App_Exception('Image CAPTCHA requires font');
        }
        
        $word  = $this->getWord();
        $w     = $this->getWidth();
        $h     = $this->getHeight();
        $fsize = $this->getFontSize();
        
        $img        = imagecreatetruecolor($w, $h);
        $text_color = imagecolorallocate($img, 0, 0, 0);
        $bg_color   = imagecolorallocate($img, 255, 255, 255);
        imagefilledrectangle($img, 0, 0, $w-1, $h-1, $bg_color);
        $textbox = imageftbbox($fsize, 0, $font, $word);
        $x = ($w - ($textbox[2] - $textbox[0])) / 2;
        $y = ($h - ($textbox[7] - $textbox[1])) / 2;
        imagefttext($img, $fsize, 0, $x, $y, $text_color, $font, $word);
        
       // generate noise
        for ($i=0; $i<100; $i++) {
           imagefilledellipse($img, mt_rand(0,$w), mt_rand(0,$h), 2, 2, $text_color);
        }
        for($i=0; $i<5; $i++) {
           imageline($img, mt_rand(0,$w), mt_rand(0,$h), mt_rand(0,$w), mt_rand(0,$h), $text_color);
        }
        
        // transformed image
        $img2     = imagecreatetruecolor($w, $h);
        $bg_color = imagecolorallocate($img2, 255, 255, 255);
        imagefilledrectangle($img2, 0, 0, $w-1, $h-1, $bg_color);
        // apply wave transforms
        $freq1 = $this->_randomFreq();
        $freq2 = $this->_randomFreq();
        $freq3 = $this->_randomFreq();
        $freq4 = $this->_randomFreq();

        $ph1 = $this->_randomPhase();
        $ph2 = $this->_randomPhase();
        $ph3 = $this->_randomPhase();
        $ph4 = $this->_randomPhase();

        $szx = $this->_randomSize();
        $szy = $this->_randomSize();
 
        for ($x = 0; $x < $w; $x++) {
            for ($y = 0; $y < $h; $y++) {
                $sx = $x + (sin($x*$freq1 + $ph1) + sin($y*$freq3 + $ph3)) * $szx;
                $sy = $y + (sin($x*$freq2 + $ph2) + sin($y*$freq4 + $ph4)) * $szy;
    
                if ($sx < 0 || $sy < 0 || $sx >= $w - 1 || $sy >= $h - 1) { 
                    continue;
                } else {
                    $color    = (imagecolorat($img, $sx, $sy) >> 16)         & 0xFF;
                    $color_x  = (imagecolorat($img, $sx + 1, $sy) >> 16)     & 0xFF;
                    $color_y  = (imagecolorat($img, $sx, $sy + 1) >> 16)     & 0xFF;
                    $color_xy = (imagecolorat($img, $sx + 1, $sy + 1) >> 16) & 0xFF;
                }
                if ($color == 255 && $color_x == 255 && $color_y == 255 && $color_xy == 255) {
                    // ignore background
                    continue;
                } elseif ($color == 0 && $color_x == 0 && $color_y == 0 && $color_xy == 0) {
                    // transfer inside of the image as-is
                    $newcolor = 0;
                } else {
                    // do antialiasing for border items
                    $frac_x  = $sx-floor($sx);
                    $frac_y  = $sy-floor($sy);
                    $frac_x1 = 1-$frac_x;
                    $frac_y1 = 1-$frac_y;

                    $newcolor = $color    * $frac_x1 * $frac_y1
                              + $color_x  * $frac_x  * $frac_y1
                              + $color_y  * $frac_x1 * $frac_y
                              + $color_xy * $frac_x  * $frac_y;
                }
                imagesetpixel($img2, $x, $y, imagecolorallocate($img2, $newcolor, $newcolor, $newcolor));
            }
        }
       
        // generate noise
        for ($i=0; $i<100; $i++) {
            imagefilledellipse($img2, mt_rand(0,$w), mt_rand(0,$h), 2, 2, $text_color);
        }
        for ($i=0; $i<5; $i++) {
           imageline($img2, mt_rand(0,$w), mt_rand(0,$h), mt_rand(0,$w), mt_rand(0,$h), $text_color);
        }
        
        //send output to browser
		header('Content-type: image/png');
        imagepng($img2);
        
        imagedestroy($img);
        imagedestroy($img2);
    }
    
    
    /**
     * Validate the word
     * @access public
     * @see App_Validate_Abstract::isValid()
     * @param mixed $value
     * @return boolean
     */
    public function isValid($value)
    {
    	return ($value == $this->getWord());
    }
}
