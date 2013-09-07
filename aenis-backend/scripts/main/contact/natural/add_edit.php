<?php
user_auth_check();
$data = $_POST['data'];
$data = App_Json::decode($data, true);

$update_array = App_Array::pick($data,array(
    'id',
    'first_name',
    'last_name',
    'second_name',
    'date_of_birth',
    'social_card_number',
    'passport_number',
    'country_id',
    'email',
    'fax',
    'phone_home',
    'phone_office',
    'phone_mobile',
    'organization_name',
    'staff_name'
));

$oContacts = null;
try
{
    $oContacts = new Contact_Natural();
    if(0 == $update_array['id'])
    {
        if(Acl()->denied('contact.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ սուբյեկտի ավելացման համար:');
            $oContacts->addContact($update_array);
    }
    else
    {
        if(Acl()->denied('contact.edit'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ սուբյեկտի խմբագրման համար:');

        $oContacts->updateContact($contact_id, $update_array);
    }

    $oContacts->db_commit();
    Ext::sendResponse(true, array(
        'data' => $data
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oContacts) $oContacts->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
