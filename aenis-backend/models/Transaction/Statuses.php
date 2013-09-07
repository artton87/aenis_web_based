<?php
/**
 * Transaction statuses management
 * @package aenis
 */

/**
 * Contains methods for management of transaction statuses list
 * @author BestSoft
 * @package aenis\workflow
 */
class Transaction_Statuses extends App_Db_Table_Abstract
{
	/**
	 * Նոր օնլայն
	 */
	const STATUS_NEW_ONLINE = 1;

    /**
     * Մերժված
     */
    const STATUS_REJECTED = 2;

	/**
	 * Մուտքագրված
	 */
	const STATUS_SUBMITTED = 3;

	/**
	 * Հաստատված
	 */
	const STATUS_APPROVED = 4;

	/**
	 * Դադարացված
	 */
	const STATUS_TERMINATED = 5;

    public function getStatuses($mode = array())
    {
        $where = array();
        if(!empty($mode))
            $where[] = "AND transaction_statuses.mode IN(".implode(', ',$mode).")";
        $where = implode(', ',array_unique($where));

        $query = "
            SELECT * FROM
            bs_transaction_statuses transaction_statuses
            WHERE 1=1 $where
            ";
        return $this->db_query($query);
    }
}
