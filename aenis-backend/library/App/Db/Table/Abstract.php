<?php
/**
 * Abstract database table definition
 * @package Framework\Db
 */


/**
 * A parent class for all database tables
 * @package Framework\Db
 * @abstract
 * @method db_connect($init_commands = array())
 * @method db_isConnected()
 * @method db_connection_link()
 * @method db_multi_query_exec()
 * @method db_free_result($result)
 * @method db_select($table, array $fields, $where = array(), array $order = array(), $count = null, $offset = null)
 * @method db_update($table, $fields, $where)
 * @method db_delete($table, $where = array())
 * @method db_insert($table, $fields, $bReturnSQLParts=false)
 * @method db_insert_id()
 * @method db_fetch_array($result_id, $result_type = '')
 * @method db_fetch_row($result_id)
 * @method db_query($query, $bAddToBatch = false)
 * @method db_num_rows($result)
 * @method db_commit()
 * @method db_rollback()
 * @method db_escape_string($s)
 */
abstract class App_Db_Table_Abstract
{
	/**
	 * @static
	 * @var App_Db_Adapter_Abstract   An adapter used for connection
	 */
	protected static $_dba = null;
	
	/**
	 * @static
	 * @var App_Translate    An App_Translate object, used for translating messages
	 */
	protected static $_translator = null;
	
	/**
	 * @static
	 * @var array    NULL value for using with adapter's insert, update and delete functions
	 */
	protected static $DB_NULL = null;
	
	/**
	 * @static
	 * @var array   CURRENT_TIMESTAMP value for using with adapter's insert, update and delete functions
	 */
	protected static $DB_TIMESTAMP = null;
	
	
	/**
	 * Constructor
	 * @access public
	 * @throws App_Db_Exception_Table if database adapter was not previously specified
	 */
    public function __construct()
	{
		if(null === self::$_dba)
			throw new App_Db_Exception_Table('No database adapter specified!');
		if(!self::$_dba->isConnected())
		{
			self::$_dba->connect();
		}
	}
	
	
	/**
	 * Sets default database adapter
	 * @static
	 * @access public
	 * @param App_Db_Adapter_Abstract $dba    An instance of App_Db_Adapter_Abstract
	 */
	public static function setAdapter($dba)
	{
		self::$_dba = $dba;
		self::$DB_NULL = self::$_dba->getStatement('NULL');
		self::$DB_TIMESTAMP = self::$_dba->getStatement('TIMESTAMP');
	}
	
	
	/**
	 * Returns default database adapter
	 * @static
	 * @access public
	 * @return App_Db_Adapter_Mysql    An instance of App_Db_Adapter_Abstract
	 */
	public static function getAdapter()
	{
		return self::$_dba;
	}
	
	
	/**
	 * Sets App_Translate object, used for translating messages
	 * @static
	 * @access public
	 * @param App_Translate $oTranslator    An App_Translate object
	 */
	public static function setTranslator($oTranslator)
	{
		self::$_translator = $oTranslator;
	}
	
	/**
	 * Returns App_Translate object, used for translating messages
	 * @static
	 * @access public
	 * @return App_Translate    An App_Translate object
	 */
	public static function getTranslator()
	{
		return self::$_translator;
	}
	
	
	/**
	 * Enables magic methods for adapter functions.
	 * To call $this->getAdapter()->query(), one can use $this->db_query()
	 * To call $this->getTranslator()->translate(), one can use $this->translate()
	 * @access public
	 * @param mixed $name    Function name
	 * @param mixed $args    Function arguments
	 * @return mixed    Function return result
	 * @throws App_Db_Exception_Table if method cannot be found
	 */
	public function __call($name, $args)
	{
		if(0!==strpos($name, 'db_')) //call as normally
		{
			if($name=='translate')
			{
				if(null === self::$_translator) return null;
				$obj = array(self::$_translator, 'translate');
			}
			else
			{
				$obj = array(self, $name);
			}
		}
		else //call appropriate db function from adapter
		{
			$obj = array($this->getAdapter(), substr($name, strlen('db_')));
		}
		
		if(!is_callable($obj, false, $callableName))
		{
			throw new App_Db_Exception_Table('Method '.$name.' has not been found!');
		}
		return call_user_func_array($obj, $args);
	}
	
	
	/**
	 * Regenerates all 'left'-lft and 'right'-rgt values required for implementation of nested sets model.
	 * Recursive pre-order tree traversal algorithm is used here. Complexity is O(<number of tree nodes>).
	 * Target table should have 'lft' and 'rgt' columns. Table prefix will be appended automatically.
	 * @param string $table          A name of table in database
	 * @param string $fld_id         A name of primary key field in database, which holds unique record id
	 * @param string $fld_parent_id  A name of field in database, which holds id of parent record
	 * @param string $fld_num        A name of field in database, which holds record order number, used for arranging records at same level
	 * @param integer $node_id  An initial value for node_id. Pass id of root node, if calling for single root node.
	 * @param integer $left     An initial value for 'lft' field. Pass 1 if calling for single root node.
	 */
	public function rebuild_lft_rgt_recurse($table, $fld_id, $fld_parent_id, $fld_num, $node_id, $left=1)
	{
	    $right = $left+1;
	 
	 	$dba = $this->getAdapter();
	    
	    // get all children of this node
	    $result = $dba->select($table, array($fld_id), array($fld_parent_id=>$node_id), array($fld_num=>'ASC'));
	    while($row = $dba->fetch_row($result))
	    {
	       // recursive execution of this function for each child of this node 
	       // $right is the current right value, which is incremented by the rebuild_lft_rgt_recurse function 
	       $right = $this->rebuild_lft_rgt_recurse($table, $fld_id, $fld_parent_id, $fld_num, $row[0], $right);
	    } 

	    // we've got the left value, and now that we've processed the children of this node we also know the right value 
	    $dba->update($table, array('lft'=>$left, 'rgt'=>$right), array($fld_id=>$node_id));

	    // return the right value of this node + 1 
	    return $right+1;
	}
}
