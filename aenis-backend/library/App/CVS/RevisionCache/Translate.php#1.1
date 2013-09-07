<?php
/**
 * Translation routines
 * @package Framework\Translate
 */

 
/**
 * Translate strings into different languages
 * @package Framework\Translate
 */
class App_Translate
{
	/**
	 * @var string    Path to directory with translations
	 */
	protected $_translations_path = null;
	
	/**
	 * @var array    Array with translation data
	 */
	protected $_translations = null;
	

	
	/**
	 * Constructor
	 * @access public
	 * @param string $path    Path to translations directory. Directory should contain subdirectories for each language.
	 */
	public function __construct($path)
	{
		$path = rtrim($path, '/\\');
		$this->_translations_path = $path.'/';
	}
	
	
	/**
	 * Returns array with all available language identifies
	 * @access public
	 * @return array    Array with language identifiers
	 */
	public function getAvailableLanguages()
	{
		$languages = array();
		if($handle = opendir($this->_translations_path))
		{
			while(false !== ($file = readdir($handle)))
			{
				if($file == '.' || $file == '..' || $file == 'CVS' || $file == 'cvs') continue;
				array_push($languages, $file);
			}
		}
		return $languages;
	}
	
	
	/**
	 * Loads translations for given language
	 * @access public
	 * @param string $lang    Language identifier (for example: am, ru, en)
	 * @param string $module    Optional. Module name. If given, loads only translations for this module
	 */
	public function loadTranslations($lang, $module = null)
	{
		$this->_translations = array();
		for(
			$it = new RecursiveDirectoryIterator($this->_translations_path.$lang.(null==$module ? '' : '/'.$module));
			$it->valid();
			$it->next()
		)
		{
			if(in_array($it->getBasename(), array('.', '..', ''))) continue;
			ob_start();
			$data = @include($it->current());
			ob_end_clean();
			if(is_array($data))
			{
				$this->_translations = array_merge($this->_translations, $data);
			}
		}
	}
	
	
	/**
	 * Translate text with given key
	 * @access public
	 * @param string $key    What to translate
	 * @return string     Either translated value, or key if translation was not found
	 */
	public function translate($key)
	{
		if(array_key_exists($key, $this->_translations))
		{
			return $this->_translations[$key];
		}
		return $key;
	}
}