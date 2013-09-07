<?php
//1 - disable login, 0 - enable
$bLock = 0;

$msg = '';
//$msg = 'Խնդրվում է թարմացնել հավելումը:';
//$msg = 'Այսօր ժամը 18:00-ին համակարգի աշխատանքը կդադարեցվի տարվող տեխնիկական աշխատանքների պատճառով: Հայցում ենք Ձեր ներողամտությունը:';

//login will be disabled during the following date interval
$lock_date_from = '2012-02-17 19:00:00';
$lock_date_till = '2012-02-19 06:00:00';
$now = mktime();
if($now > App_Date::isoDatetime2Timestamp($lock_date_from) && $now < App_Date::isoDatetime2Timestamp($lock_date_till))
{
	$bLock = 1;
	$msg = "Համակարգի աշխատանքը ժամանակավորապես դադարեցված է տարվող տեխնիկական աշխատանքների պատճառով (ավարտը` $lock_date_till): Հայցում ենք Ձեր ներողամտությունը:";
}

Ext::sendResponse(true, array('lock'=>$bLock, 'msg'=>$msg));
