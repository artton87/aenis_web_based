<?php
/**
 * Calender days management
 * @package aenis
 */

/**
 * Methods for calendar days management
 * @author BestSoft
 * @package aenis
 */
class CalendarDays extends App_Db_Table_Abstract
{
	/**
	 * Holidays
	 */
	const DAY_TYPE_HOLIDAY = 'holiday';
	
	/**
	 * Mourning days
	 */
	const DAY_TYPE_MOURNING = 'mourning';
	
	/**
	 * Days of other types
	 */
	const DAY_TYPE_OTHER = 'other';
	
	
	/**
	 * Returns days matching given criteria
	 * @access public
	 * @param array $search    Associative array with search parameters
	 * @param boolean $bAsArray    Optional. True, if result should be returned as array
	 * @return mysqli_result|resource|array
	 */
	public function getDays($search, $bAsArray = false)
	{
		$dba = $this->getAdapter();
		
		$where = array();
		if(!empty($search['day_id']))
			$where[] = 'day.id='.$dba->escape_string($search['day_id']);
			
		if(!empty($search['year']))
			$where[] = 'YEAR(day.day_date)='.$dba->escape_string($search['year']);
			
		if(!empty($search['month']))
			$where[] = 'MONTH(day.day_date)='.$dba->escape_string($search['month']);
			
		if(!empty($search['day']))
			$where[] = 'DAYOFMONTH(day.day_date)='.$dba->escape_string($search['day']);
		
		if(!empty($search['date_from']))
			$where[] = 'day.day_date>='.App_Date::str2SqlDate($search['date_from'], true);
			
		if(!empty($search['date_till']))
			$where[] = 'day.day_date<='.App_Date::str2SqlDate($search['date_till'], true);
		
		$where = (count($where)>0) ? 'WHERE '.implode(' AND ', $where) : '';
		
		$q = "SELECT
				day.id,
				day.description,
				DAYOFMONTH(day.day_date) AS day_d,
				MONTH(day.day_date) AS day_m,
				YEAR(day.day_date) AS day_y,
				day.day_date,
				day.day_type,
				day.is_business,
				day.is_nonbusiness
			FROM bs_calendar_days day
			$where";
		$result = $dba->query($q);
		if($bAsArray)
		{
			$days = array();
			while($row = $dba->fetch_array($result))
			{
				$days[] = array(
					'day' => $row['day_d'],
					'month' => $row['day_m'],
					'year' => $row['day_y'],
					'is_business' => $row['is_business'],
					'is_nonbusiness' => $row['is_nonbusiness']
				);
			}
			return $days;
		}
		return $result;
	}
	
	
	/**
	 * Fills days of given year by copying them from previous year
	 * @access public
	 * @param integer $dstYear    Destination year
	 * @param integer $srcYear    Source year, from which days will be taken
	 */
	public function autofillFromYear($dstYear, $srcYear)
	{
		$result = $this->getDays(array('year'=>$srcYear));
		while($row = $this->db_fetch_array($result))
		{
			//remove day at that place if such exists
			$result_check = $this->getDays(array('year'=>$dstYear, 'month'=>$row['day_m'], 'day'=>$row['day_d']));
			if($row_check = $this->db_fetch_array($result_check))
			{
				$this->deleteDay($row_check['id']);
			}
			
			//get correct date
			$ts = mktime(0,0,0, $row['day_m'], $row['day_d'], $dstYear);
			$date = getdate($ts);
    		$d = $date['mday'];
    		$m = $date['mon']; 
    		$y = $date['year'];
    		
    		//add new day
			$this->addDay(array(
				'description' => $row['description'],
        		'day_type' => $row['day_type'],
        		'is_nonbusiness' => $row['is_nonbusiness'],
        		'is_business' => $row['is_business'],
        		'day_date' => sprintf('%02d/%02d/%04d',$d,$m,$y)
			));
		}
	}
	
	
    /**
     * Checks day details
     * @access protected
     * @param integer $day_id    Day ID
     * @param array $data   Associative array with day fields
     */
    protected function validateDay($day_id, $data)
    {
    }
    
    
    /**
     * Returns fields, which can be passed to database adapter's insert and update methods
     * @access protected
     * @param array $data    Associative array with day fields
     * @return array    Fields, which can be passed to database adapter methods
     */
    protected function getDbFields($data)
    {
		return array(
			'description' => $data['description'],
        	'day_type' => $data['day_type'],
        	'is_nonbusiness' => $data['is_nonbusiness'],
        	'is_business' => $data['is_business'],
        	'day_date' => App_Date::str2SqlDate($data['day_date'])
        );
    }
    
    
    /**
     * Add new day
     * @access public
     * @param array $data    Associative array with day fields
     * @return integer    ID of newly created day
     */
	public function addDay($data)
	{
		$this->validateDay(0, $data);
        
        $insert_data = $this->getDbFields($data);
        $this->db_insert('calendar_days', $insert_data);
        $day_id = $this->db_insert_id();
        
        Table_Log::insert_added('calendar_days', $day_id, $insert_data);
	}
	
	
	/**
     * Edit an existing day
     * @access public
     * @param integer $day_id    Day ID
     * @param array $data    Associative array with day fields
	 * @throws App_Db_Exception_Table if day id is not specified
     */
    public function updateDay($day_id, $data)
    {
        if(empty($day_id))
        	throw new App_Db_Exception_Table('Day ID is not specified');
        $this->validateDay($day_id, $data);
        
        $update_data = $this->getDbFields($data);
        unset($update_data['day_date']);
        $old_select = $this->db_select('calendar_days', array(), array('id'=>$day_id));
        Table_Log::insert_modified('calendar_days', $day_id, $old_select, $update_data);
        
        $this->db_update('calendar_days', $update_data, array('id'=>$day_id));
    }
	
	
	/**
	 * Removes day with the given ID
	 * @access public
	 * @param string $id    Day ID
	 */
	public function deleteDay($id)
	{
		Table_Log::insert_deleted('calendar_days', $id, 'id');
		$this->db_delete('calendar_days', array('id'=>$id));
	}
}
