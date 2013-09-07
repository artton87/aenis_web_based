<?php
/**
 * HTTP request handling
 * @package Framework\Request
 */

 
/**
 * Provides convenient way for getting HTTP request parameters
 * @package Framework\Request
 */
class App_Request
{
	/**
	 * @var boolean    Used in _urldecodeArrayEntry callback
	 */
	private $_bDecode = null;
	
	/**
	 * @var boolean    Whenever x-technology=ajax parameter has been passed
	 */
	protected $_bIsAjax = false;
	
	
	/**
	 * Constructor. Initializes request object
	 * @access public
	 */
	public function __construct()
	{
		if($this->getParam('x-technology') == 'ajax')
		{
			$this->_bIsAjax = true;
		}
	}
	
	
	/**
	 * Returns parameter value by name
	 * @access public
	 * @param string $name    Parameter name
	 * @param boolean $bDecode    Whenever to urldecode post parameter
	 * @return string    Parameter value
	 */
	public function getParam($name, $bDecode = false)
	{
		$v = $this->getGetParam($name);
		if(null !== $v) return $v;
		
		$v = $this->getPostParam($name, $bDecode);
		if(null !== $v) return $v;
		
		return null;
	}
	
	
	/**
	 * Returns GET parameter value by name
	 * @access public
	 * @param string $name    Parameter name
	 * @return string    Parameter value
	 */
	public function getGetParam($name)
	{
		$bMagicQuotesOn = get_magic_quotes_gpc();
		if(array_key_exists($name, $_GET))
		{
			return $bMagicQuotesOn ? stripslashes($_GET[$name]) : $_GET[$name];
		}
		return null;
	}
	
	
	/**
	 * Returns POST parameter value by name
	 * @access public
	 * @param string $name    Parameter name
	 * @param boolean $bDecode    Whenever to urldecode post parameter
	 * @return string    Parameter value
	 */
	public function getPostParam($name, $bDecode = false)
	{
		$bMagicQuotesOn = get_magic_quotes_gpc();
		if(array_key_exists($name, $_POST))
		{
			$v = $_POST[$name];
			if(is_string($v))
			{
				if($bDecode)
					$v = urldecode($v);
				return $bMagicQuotesOn ? stripslashes($v) : $v;
			}
			elseif(is_array($v))
			{
				$this->_bDecode = $bDecode;
				array_walk_recursive($v, array($this,'_urldecodeArrayEntry'));
				$this->_bDecode = null;
				return $v;
			}
		}
		return null;
	}

		
	/**
     * Return the value of the given HTTP header.
     * Pass the header name as the plain, HTTP-specified header name.
     * Example: Ask for 'Accept' to get the Accept header, 'Accept-Encoding' to get the Accept-Encoding header.
     * @access public
     * @param string $header    HTTP header name
     * @return string|null    HTTP header value, or null if not found
     */
    public function getHeader($header)
    {
        // Try to get it from the $_SERVER array first
        $temp = 'HTTP_' . strtoupper(str_replace('-', '_', $header));
        if(!empty($_SERVER[$temp])) return $_SERVER[$temp];

        // This seems to be the only way to get the Authorization header on Apache
        if (function_exists('apache_request_headers'))
        {
            $headers = apache_request_headers();
            if(!empty($headers[$header])) return $headers[$header];
        }
        return null;
    }
    
    
	/**
	 * Checks if request has been made using XMLHttpRequest.
	 * Checks X-Requested-With header with value XMLHttpRequest
	 * @access public
	 * @return boolean
	 */
	public function isXMLHttpRequest()
	{
		return ($this->getHeader('X-Requested-With')=='XMLHttpRequest');
	}
	
	/**
	 * Checks if request has been made using ajax, either by XMLHttpRequest or another technology
	 * Checks X-Requested-With header with value XMLHttpRequest and x-technology=ajax request parameter
	 * @access public
	 * @return boolean
	 */
	public function isAjaxRequest()
	{
		return $this->isXMLHttpRequest() || $this->_bIsAjax;
	}
}
