<?php
/**
 * Abstract validator definition
 * @package Framework\Validate
 */

 
/**
 * Parent class for all validator classes
 * @package Framework\Validate
 * @abstract
 */
abstract class App_Validate_Abstract
{
	/**
	 * @var string    Validator failure message or message key if translator is set up
	 */
	protected $_message;
	
	/**
	 * @static
	 * @var App_Translate    A translator for translating failure messages
	 */
	protected static $_translator = null;
	
	
	/**
	 * Sets App_Translate object, used for translating failure messages
	 * @static
	 * @access public
	 * @param App_Translate $oTranslator    An App_Translate object
	 */
	public static function setTranslator($oTranslator)
	{
		self::$_translator = $oTranslator;
	}
	
	/**
	 * Returns App_Translate object, used for translating failure messages
	 * @static
	 * @access public
	 * @return App_Translate    An App_Translate object
	 */
	public static function getTranslator()
	{
		return self::$_translator;
	}
	
	
	
	/**
	 * A constructor
	 * @access protected
	 * @param string $message    A failure message
	 * @return App_Validate_Abstract
	 */
	public function __construct($message='')
	{
		$this->setMessage($message);
	}
	
	
	/**
	 * Sets validator failure message or message key
	 * @access public
	 * @param string $message    A message or message key
	 */
	public function setMessage($message)
	{
		$this->_message = $message;
	}
	
	/**
	 * Returns validator failure message or message key
	 * @access public
	 * @param string $message    A message or message key
	 */
	public function getMessage($message)
	{
		$this->_message = $message;
	}
	
	/**
	 * Returns translated validator failure message
	 * @access public
	 * @return string    A failure message
	 */
	public function getFailureMessage()
	{
		return (null!==self::$_translator) ? self::$_translator->translate($this->_message) : $this->_message;
	}
	
	
	/**
	 * Checks if given value is valid
	 * @abstract
	 * @param mixed $value    A value to be checked
	 * @return boolean    True - if value is valid, false - otherwise
	 */
	abstract public function isValid($value);
}