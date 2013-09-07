<?php
/**
 * Transaction statuses management
 * @package aenis
 */

/**
 * Contains methods for transaction statuses management
 * @author BestSoft
 * @package aenis\workflow
 */
class Transactions_Status extends HistoricalTable
{
	/**
	 * Table name as in database
	 * @var string
	 */
    protected $_table = 'transactions_status';


    /**
     * Sets status for the given transaction
	 * @access public
     * @param integer $tr_id    Transaction id
     * @param integer $status_id    Transaction status id. One of constants declared in Transaction_Statuses class.
	 * @return integer    Id of newly inserted record
     */
    public function setTransactionStatus($tr_id, $status_id)
    {

		$insert_data = array(
			'tr_id' => $tr_id,
			'tr_status_id' => $status_id
		);
		if($row = $this->getActualUsingAdjacencyListModel(array('tr_id'=>$tr_id)))
		{
			return $this->updateUsingAdjacencyListModel($row['id'], $insert_data);
		}
		return $this->insertUsingAdjacencyListModel($insert_data);
    }


    /**
     * gets transaction status by given integer 'transaction id'
     * @param $tr_id
     */
    public function getTransactionStatus($tr_id)
    {
        return $this->db_select($this->_table,array('tr_status_id'), array('tr_id'=>$tr_id));
    }
}
