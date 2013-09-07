<?php

user_auth_check();

$start = $_POST['start'];
$limit = $_POST['limit'];

//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'search_contacts';

//prepare POST variables, to be stored into session
$basic_collection_items = array(
    'contact_id' => new App_Session_Item_PostString('id'),
    'storage' 	 => new App_Session_Item_PostString('storage'),
    'organization_name' 	=> new App_Session_Item_PostString('organization_name'),
    'registration_number'=> new App_Session_Item_PostString('registration_number'),
    'tax_account' 		=> new App_Session_Item_PostString('tax_account'),
    'empty_organization_name' 	=> new App_Session_Item_PostString('empty_organization_name'),
    'empty_registration_number'	=> new App_Session_Item_PostString('empty_registration_number'),
    'empty_tax_account' 		=> new App_Session_Item_PostString('empty_tax_account')
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
$oContacts = new Contact_Juridical();
$total = 0;
if($search['storage'] == 'from_db') //for both natural and juridical persons
{
    if(1 == $_POST['init'])
    {
        $total = $oContacts->getContacts($search,true);
        $oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
    }
    else
    {
        $total = $oSession->getItem('total', $session_collection_key);
    }
}

if($search['storage'] == 'from_db')
{
    $result = $oContacts->getContacts($search, $start, $limit);
    while($row = $oContacts->db_fetch_array($result))
    {
		$organization_type = '';
		$types = new Contact_Juridical_Types();
		$resultType = $types->getTypes(array('id'=>$row['organization_type_id']));
		if($rowType = $types->db_fetch_array($resultType))
		{
			$organization_type = $rowType['name'];
		}

        $items[] = array(
            'contact_id' => $row['contact_id'],
            'tax_account' => $row['tax_account'],
            'organization_name' => $row['organization_name'],
            'is_verified' => !empty($row['is_verified']),
            'organization_type_id' => $row['organization_type_id'],
            'organization_type' => $organization_type,
            'registration_number' => $row['registration_number'],
            'address' => $row['address'],
            'contactType' => 'juridical',
            'foundation_date' => App_Date::isoDateTime2Str($row['foundation_date'],true),
            'certificate_number' => $row['certificate_number'],
            'phone' => $row['phone'],
            'email' => $row['email'],
            'website' => $row['website'],
            'additional_information' => $row['additional_information']
        );
    }
}
elseif($search['storage'] == 'from_e_register')
{
    $items = $oContacts->getContactsFromRegister($search);

}

Ext::sendResponse(true, array(
    'data' => $items,
    'total' => $total
));
