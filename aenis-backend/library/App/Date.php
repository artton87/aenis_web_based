<?php
/**
 * Date functions
 * @package Framework\Date
 */

 
/**
 * Provides utility methods for working with date strings
 * @package Framework\Date
 */
class App_Date
{
	/**
	 * Converts given string to ISO format. If passed date is not
	 * in valid dd/mm/yyyy format, an empty string will be returned.
	 * @static
	 * @access public
	 * @param string $strDate    A date in dd/mm/yyyy format
	 * @param boolean $bQuote    If TRUE, encloses returned string in sql quotes
	 * @return string    A date in MySQL yyyy-mm-dd format
	 */
	public static function str2SqlDate($strDate, $bQuote=false)
	{
		$oValidator = new App_Validate_Date('');
	    if(FALSE === $oValidator->isValid($strDate)) return '';
	    list($d, $m, $y) = sscanf($strDate, '%d/%d/%d');
	    $sql_date = sprintf('%04d-%02d-%02d', $y, $m, $d);
	    return $bQuote ? "'$sql_date'" : $sql_date;
	}
	
	/**
     * Converts given datetime string in dd/mm/yyyy hh:mm:ss format to "yyyy-mm-dd hh:mm:ss" format.
     * If passed date is empty, an empty string will be returned.
     * @static
     * @access public
     * @param string $strDate    A date in ISO yyyy-mm-dd hh:mm:ss format
     * @param boolean $bQuote    If TRUE, encloses returned string in sql quotes
     * @return string    A date in yyyy-mm-dd hh:mm:ss format
     */
    public static function str2SqlDateTime($strDate, $bQuote=false)
    {
        $oValidator = new App_Validate_DateTime('');
	    if(FALSE === $oValidator->isValid($strDate)) return '';
        list($d, $m, $y, $h, $min, $sec) = sscanf($strDate, '%d/%d/%d %d:%d:%d');
        $sql_date = sprintf('%04d-%02d-%02d %02d:%02d:%02d', $y, $m, $d, $h, $min, $sec);
        return $bQuote ? "'$sql_date'" : $sql_date;
    }

	
	/**
	 * Converts given mysql date string to dd/mm/yyyy format. If passed date
	 * is not in valid yyyy-mm-dd format, an empty string will be returned.
	 * @static
	 * @access public
	 * @param string $strSqlDate    A date in ISO yyyy-mm-dd format
	 * @return string    A date in dd/mm/yyyy format
	 */
	public static function sqlDate2Str($strSqlDate)
	{
		$oValidator = new App_Validate_IsoDate('');
		if(FALSE === $oValidator->isValid($strSqlDate)) return '';
	    list($y, $m, $d) = sscanf($strSqlDate, '%d-%d-%d');
	    return sprintf('%02d/%02d/%04d', $d, $m, $y);
	}
    
    /**
     * Converts given string to UNIX timestamp. If passed
     * date is not in valid dd/mm/yyyy format, returns 0.
     * @static
     * @access public
     * @param string $strDate    A date in dd/mm/yyyy format
     * @return integer    A UNIX timestamp value
     */
    public static function str2Timestamp($strDate)
    {
        $oValidator = new App_Validate_Date('');
        if(FALSE === $oValidator->isValid($strDate)) return 0;
        list($d, $m, $y) = sscanf($strDate, '%d/%d/%d');
        return mktime(0,0,0, $m, $d, $y);
    }
    
    
    /**
     * Converts given mysql datetime string to "dd/mm/yyyy hh:mm:ss" format. If passed date
     * is empty, an empty string will be returned.
     * @static
     * @access public
     * @param string $isoDatetime    A date in ISO yyyy-mm-dd hh:mm:ss format
     * @param boolean $skipTime    Whenever to skip time part
     * @return string    A date in dd/mm/yyyy hh:mm:ss format
     */
    public static function isoDatetime2Str($isoDatetime, $skipTime = false)
    {
        if(empty($isoDatetime)) return '';
        list($y, $m, $d, $h, $min, $sec) = sscanf($isoDatetime, '%d-%d-%d %d:%d:%d');
        return $skipTime ? sprintf('%02d/%02d/%04d', $d, $m, $y) : sprintf('%02d/%02d/%04d %02d:%02d:%02d', $d, $m, $y, $h, $min, $sec);
    }
    
    /**
     * Converts given datetime in ISO format to UNIX timestamp. If passed
     * string is not in valid "yyyy-mm-dd h:m:s" format, returns ''.
     * @static
     * @access public
     * @param string $isoDatetime    A date in "yyyy-mm-dd h:m:s" format
     * @return integer    A UNIX timestamp value
     */
    public static function isoDatetime2Timestamp($isoDatetime)
    {
        if(empty($isoDatetime)) return '';
        list($y, $m, $d, $h, $min, $sec) = sscanf($isoDatetime, '%d-%d-%d %d:%d:%d');
        return mktime($h, $min, $sec, $m, $d, $y);
    }
    
    /**
     * Converts given timestamp value to ISO yyyy-mm-dd hh:mm:ss format
     * @static
     * @access public
     * @param int $timestamp    Date timestamp
     * @param boolean $skipTime    Whenever to skip time part
     * @return string    A date in ISO yyyy-mm-dd hh:mm:ss format
     */
    public static function timestamp2IsoDatetime($timestamp, $skipTime = false)
    {
    	$date = getdate($timestamp);
    	$d = $date['mday'];
    	$m = $date['mon']; 
    	$y = $date['year'];
    	if($skipTime)
    	{
    		return sprintf('%04d-%02d-%02d', $y, $m, $d);
    	}
    	$h = $date['hours'];
    	$min = $date['minutes'];
    	$sec = $date['seconds'];
        return sprintf('%04d-%02d-%02d %02d:%02d:%02d', $y, $m, $d, $h, $min, $sec);
    }
	
	/**
	 * Returns difference of UNIX timestamp values of two given dates
	 * @static
	 * @access public
	 * @param string $date1    A first date in dd/mm/yyyy format
	 * @param string $date2    A second date in dd/mm/yyyy format
	 */
	public static function compareDate($date1, $date2)
	{
	    return self::str2Timestamp($date1) - self::str2Timestamp($date2);
	}
	
	
	
	
	/**
	 * Return true, if given day is a weekend
	 * @access public
	 * @param int $timestamp    Date timestamp
	 * @param array $vWeekendDays    Array with days to be considered as weekend. Index of days is 1-based. Days start from Monday.
	 * @return bool
	 */
	public static function isWeekend($timestamp, $vWeekendDays)
	{
		$date = getdate($timestamp);
		$wd = $date['wday'];
		if($wd==0) $wd=7; //to start from Monday
		return in_array($wd, $vWeekendDays);
	}

	
	/**
	 * Add/substracts given amount of days, months, years, hours, minutes or seconds to given date
	 * @access public
	 * @param int $timestamp    Original date timestamp
	 * @param int $nDays    Number of days to add. Pass negative value to substract
	 * @param int $nMonths    Number of months to add. Pass negative value to substract
	 * @param int $nYears    Number of years to add. Pass negative value to substract
	 * @param int $nHours    Number of hours to add. Pass negative value to substract
	 * @param int $nMinutes    Number of minutes to add. Pass negative value to substract
	 * @param int $nSeconds    Number of seconds to add. Pass negative value to substract
	 * @return int   Resulting date timestamp
	 */
	public static function addDays($timestamp, $nDays=0, $nMonths=0, $nYears=0, $nHours=0, $nMinutes=0, $nSeconds=0)
	{
		$date = getdate($timestamp);
		return mktime(
			intval($date['hours'])+$nHours,
			intval($date['minutes'])+$nMinutes,
			intval($date['seconds'])+$nSeconds,
			intval($date['mon'])+$nMonths,
			intval($date['mday'])+$nDays,
			intval($date['year'])+$nYears
		);
	}
	
	
	/**
	 * Returns TRUE, if given timestamp corresponds to non-business day
	 * Here each special day should be given as an array with following keys:
	 *   day, month, year - holding day, month and year of particular day, correspondingly. Day can be from 1 to 31, month from 1 to 12
	 *   is_business - flag, if 1 - day should be considered as business day
	 *   in_nonbusiness - flag, if 1 - day should be considered as non-business day
 	 * @access public
	 * @param int $timestamp    Date timestamp
	 * @param array $vSpecialDays    Array with information about special days. Should be loaded from db.
	 * @param array $vWeekendDays    Array with days to be considered as weekend. Index of days is 1-based.
	 * @return bool
	 */
	public static function isNonBusinessDay($timestamp, $vSpecialDays, $vWeekendDays)
	{
		$bSkipDay = false;
			
		$bWeekend = false;
		if(self::isWeekend($timestamp, $vWeekendDays))
		{
			$bWeekend = true;
			$bSkipDay = true;
		}
		
		$date = getdate($timestamp);
		foreach($vSpecialDays as $specialDay)
		{
			if($date['mday']==$specialDay['day'] && $date['mon']==$specialDay['month'] && $date['year']==$specialDay['year'])
			{
				if($bWeekend)
				{
					if(1==$specialDay['is_business']) $bSkipDay = false;
				}
				else
				{
					if(1==$specialDay['is_nonbusiness']) $bSkipDay = true;
				}
				break;
			}
		}
		
		return $bSkipDay;
	}
	

	/**
	 * Add/substracts given amount of business days, taking into account holidays and weekends.
	 * Here each special day should be given as an array with following keys:
	 *   day, month, year - holding day, month and year of particular day, correspondingly. Day can be from 1 to 31, month from 1 to 12
	 *   is_business - flag, if 1 - day should be considered as business day
	 *   in_nonbusiness - flag, if 1 - day should be considered as non-business day
 	 * @access public
	 * @param int $timestamp    Start date timestamp
	 * @param int $nDays    Number of days to add. Pass negative value to substract
	 * @param array $vSpecialDays    Array with information about special days. Should be loaded from db.
	 * @param array $vWeekendDays    Array with days to be considered as weekend. Index of days is 1-based.
	 * @return int   Resulting date timestamp
	 */
	public static function addBusinessDays($timestamp, $nDays, $vSpecialDays, $vWeekendDays)
	{
		$nDaysDelta = $nDays<0 ? -1 : 1;
		$d = abs($nDays);
		
		$non_business_days_exist = false;
		foreach($vSpecialDays as $vSpecialDay)
		{
			if(1==$vSpecialDay['is_nonbusiness'])
			{
				$non_business_days_exist = true;
				break;
			}
		}
		if(false===$non_business_days_exist)
		{
			$working_week_length = 7 - count($vWeekendDays);
			$timestamp = self::addDays($timestamp, intval($nDays/$working_week_length) * 7);
			$d %= $working_week_length;
		}
		
		while($d>=0)
		{
			$bSkipDay = self::isNonBusinessDay($timestamp, $vSpecialDays, $vWeekendDays);
			$timestamp = self::addDays($timestamp, $nDaysDelta);
			if(!$bSkipDay) --$d;
		}
		
		return self::addDays($timestamp, -$nDaysDelta);
	}
	
	
	/**
	 * Returns number of business days between two given dates
	 * Here each special day should be given as an array with following keys:
	 *   day, month, year - holding day, month and year of particular day, correspondingly. Day can be from 1 to 31, month from 1 to 12
	 *   is_business - flag, if 1 - day should be considered as business day
	 *   in_nonbusiness - flag, if 1 - day should be considered as non-business day
 	 * @access public
	 * @param int $timestamp1    Start date timestamp
	 * @param int $timestamp2    End date timestamp
	 * @param array $vSpecialDays    Array with information about special days. Should be loaded from db.
	 * @param array $vWeekendDays    Array with days to be considered as weekend. Index of days is 1-based.
	 * @return int   Number of days
	 */
	public static function getBusinessDaysBetween($timestamp1, $timestamp2, $vSpecialDays, $vWeekendDays)
	{
		$nDays = 0;
		
		$non_business_days_exist = false;
		foreach($vSpecialDays as $vSpecialDay)
		{
			if(1==$vSpecialDay['is_nonbusiness'])
			{
				$non_business_days_exist = true;
				break;
			}
		}
		if(false===$non_business_days_exist)
		{
			$nAllDays = self::getDaysBetween($timestamp1, $timestamp2);
			if($nAllDays>7)
			{
				$nWeeks = intval($nAllDays/7);
				$nDays += $nWeeks*(7-count($vWeekendDays));
				$timestamp1 = self::addDays($timestamp1, $nWeeks*7);
			}
		}
		
		for($ts = $timestamp1; $ts<$timestamp2; $ts = self::addDays($ts, 1))
		{
			if(!self::isNonBusinessDay($ts, $vSpecialDays, $vWeekendDays))
			{
				++$nDays;
			}
		}
		return $nDays;
	}
	
	
	/**
	 * Returns number of days between two given dates
 	 * @access public
	 * @param int $timestamp1    Start date timestamp
	 * @param int $timestamp2    End date timestamp
	 * @return int   Number of days
	 */
	public static function getDaysBetween($timestamp1, $timestamp2)
	{
		if($timestamp2>$timestamp1) 
		{
			return intval(ceil(($timestamp2-$timestamp1) / 86400)); //60*60*24
		}
		return 0;
	}
}
