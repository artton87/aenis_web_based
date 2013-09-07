<?php
/**
 * Database adapter 'row is referenced' exception definition
 * @package Framework\Db
 */

 
/**
 * Exception, which is fired when code attempts to delete row, which is referenced by other rows.
 * In MySQL, this cause ER_ROW_IS_REFERENCED error with message "Cannot delete or update a parent row: a foreign key constraint fails"
 * @package Framework\Db
 */
class App_Db_Exception_RowIsReferenced extends App_Db_Exception_Adapter
{
}
