<?php



user_auth_check();

$start = $_POST['start'];
$limit= $_POST['limit'];


//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'search_contacts';

//prepare POST variables, to be stored into session
$basic_collection_items = array(
    'contact_id' => new App_Session_Item_PostString('id'),
    'storage' 	 => new App_Session_Item_PostString('storage'),
    'first_name' 		=> new App_Session_Item_PostString('first_name'),
    'last_name' 			=> new App_Session_Item_PostString('last_name'),
    'second_name' 		=> new App_Session_Item_PostString('second_name'),
    'social_card_number' => new App_Session_Item_PostString('social_card_number'),
    'passport_number' 	=> new App_Session_Item_PostString('passport_number'),
    'date_of_birth' 		=> new App_Session_Item_PostString('date_of_birth'),
    'death_certificate'     => new App_Session_Item_PostString('death_certificate'),
    'empty_first_name' 		=> new App_Session_Item_PostString('empty_first_name'),
    'empty_last_name' 		=> new App_Session_Item_PostString('empty_last_name'),
    'empty_second_name' 		=> new App_Session_Item_PostString('empty_second_name'),
    'empty_social_card_number' => new App_Session_Item_PostString('empty_social_card_number'),
    'empty_passport_number' 	=> new App_Session_Item_PostString('empty_passport_number'),
    'empty_date_of_birth'	=> new App_Session_Item_PostString('empty_date_of_birth'),
    'empty_death_certificate'	=> new App_Session_Item_PostString('empty_death_certificate')
);

if(1 == $_POST['init']) //if init=1 found in request, reset session
{
    //unset search parameters
    $oSession->unsetCollection($session_collection_key);

    //set search parameters into session
    $oSession->setItems($basic_collection_items, $session_collection_key);
}

//get search parameters from session
$keys = array_keys($basic_collection_items);
$search = $oSession->getItems($keys, $session_collection_key);


$items = array();
$oContacts = new Contact_Natural();
$total = 0;
if($search['storage'] == 'from_db') //for natural persons
{
    if(1 == $_POST['init'])
    {
        $total = $oContacts->getContacts($search,0,0,true);
        $oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
    }
    else
    {
        $total = $oSession->getItem('total', $session_collection_key);
    }
}
if($search['storage'] == 'from_db')
{
    $result = $oContacts->getContacts($search,$start,$limit);
    while($row = $oContacts->db_fetch_array($result))
    {
        $items[] = array(
            'id' => $row['id'],
            'social_card_number' => $row['social_card_number'],
            'passport_number' => $row['passport_number'],
            'given_date' => $row['given_date'],
            'authority' => $row['authority'],
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'second_name' => $row['second_name'],
            'date_of_birth' => App_Date::isoDateTime2Str($row['date_of_birth'],true),
            'country_label' => $row['country_name'],
            'country_id' => $row['country_id'],
            'phone_home' => $row['phone_home'],
            'phone_office' => $row['phone_office'],
            'phone_mobile' => $row['phone_mobile'],
            'staff_name' => $row['staff_name'],
            'organization_name' => $row['organization_name'],
            'email' => $row['email'],
            'fax' => $row['fax'],
            'address' => $row['address'],
            'death_certificate' => $row['death_certificate'],
            'place_of_residence' => $row['place_of_residence'],
        );
    }
}
elseif($search['storage'] == 'from_nork')
{
    $items = $oContacts->getContactsFromNorq($search);
}
elseif($search['storage'] == 'from_mergelyan')
{
    $items = $oContacts->getContactsFromMergelyan($search);

    //$items = $oContacts->getContactsUsingAvvWebService($search);
}

Ext::sendResponse(true, array(
    'data' => $items,
    'total' => $total
));
