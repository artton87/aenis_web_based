<?php
user_auth_check();

$lang_ids = array();
if($_REQUEST['default_language_only'])
{
	$oLanguages = new Languages();
	$lang_ids = array($oLanguages->getDefaultLanguage()->id);
}
else
{
	if(!empty($_GET['lang_ids']))
	{
		$lang_ids = $_GET['lang_ids'];
		$lang_ids = explode(',', $lang_ids);
	}
}

$cache_id = 'rates';
//if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
    $items = array();
    $o = new Rates();
    $result = $o->getRates(array(), $lang_ids);
    while($row = $o->db_fetch_array($result))
    {
        $items[] = array(
            'id' => $row['id'],
            'tr_type_id' => $row['tr_type_id'],
            'tr_type_label' => $row['tr_type_label'],
            'parcel_purpose_type_id' => $row['parcel_purpose_type_id'],
            'building_type_id' => $row['building_type_id'],
            'inheritor_type_id' => $row['inheritor_type_id'],
            'inheritor_type_label' => $row['inheritor_type_label'],
            'state_fee_coefficient' => $row['state_fee_coefficient']
        );
    }
   // App_Cache()->set($cache_id, $items, null, array(Party_Types::CACHE_TAG), true);
}

Ext::sendResponse(true, array(
    'data' => $items
));
