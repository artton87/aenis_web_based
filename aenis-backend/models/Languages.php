<?php
/**
 * Languages management
 * @package aenis\Classifiers
 */

/**
 * Contains methods for languages management
 * @author BestSoft
 * @package aenis\Classifiers
 */
class Languages extends App_Db_Table_Abstract
{
	/**
	 * Tag for cache entry
	 */
	const CACHE_TAG = 'languages';


	/**
	 * Database table name
	 * @var string
	 */
	protected $_table = 'languages';


	/**
	 * Im-memory cache of languages data
	 * @var array
	 */
	protected $_languages_cache = null;


	/**
	 * Updates languages cache.
	 * After updating languages can be selected without querying database.
	 * @access protected
	 */
	protected function updateLanguagesCache()
	{
		if(null == $this->_languages_cache)
		{
			$cache_id = 'languages';
			if(false === ($this->_languages_cache = App_Cache()->get($cache_id, true, true)))
			{
				$q = "SELECT /*! SQL_CACHE */ tbl.* FROM bs_{$this->_table} tbl ORDER BY tbl.is_default DESC, tbl.id ASC";
				$result = $this->db_query($q);
				while($row = $this->db_fetch_array($result))
				{
					$code = $row['code'];
					unset($row['code']);
					$this->_languages_cache[$code] = $row;
				}
			}
			App_Cache()->set($cache_id, $this->_languages_cache, null, array(self::CACHE_TAG), true);
		}
	}


	/**
	 * Returns list of application languages
	 * @access public
	 * @return array    Array of objects with 'id','code','language' properties
	 */
	public function getLanguages()
	{
		$this->updateLanguagesCache();
		$languages = array();
		foreach($this->_languages_cache as $lang_code=>$lang_info)
		{
			$lang = new stdClass;
			$lang->id = $lang_info['id'];
			$lang->code = $lang_code;
			$lang->title = $lang_info['title'];
			$lang->is_default = $lang_info['is_default'];
			$languages[] = $lang;
		}
		return $languages;
	}


	/**
	 * Returns map of language code to language id
	 * @access public
	 * @return array    Associative array. Keys are language codes, values and language ids
	 */
	public function getLanguagesCodeIdMap()
	{
		$this->updateLanguagesCache();
		$languages = array();
		foreach($this->_languages_cache as $lang_code=>$lang_info)
		{
			$languages[$lang_code] = $lang_info['id'];
		}
		return $languages;
	}


	/**
	 * Returns default language info
	 * @access public
	 * @return stdClass    An object with language details
	 * @throws App_Db_Exception_Table if default language cannot be found
	 */
	public function getDefaultLanguage()
	{
		$this->updateLanguagesCache();
		foreach($this->_languages_cache as $lang_code=>$lang_info)
		{
			if($lang_info['is_default'])
			{
				$lang = new stdClass;
				$lang->id = $lang_info['id'];
				$lang->code = $lang_code;
				$lang->title = $lang_info['title'];
				$lang->is_default = $lang_info['is_default'];
				return $lang;
			}
		}
		throw new App_Db_Exception_Table('No default language specified!');
	}
}
