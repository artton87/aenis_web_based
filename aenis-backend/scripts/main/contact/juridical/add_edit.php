<?php

user_auth_check();
$data = $_POST['data'];
$data = App_Json::decode($data, true);

$update_array = App_Array::pick($data,array(
        'organization_name',
        'organization_type_id',
        'registration_number',
        'tax_account',
        'foundation_date',
        'certificate_number',
        'phone',
        'fax',
        'website',
        'email',
        'country_id',
        'address',
        'additional_information',
        'contact_type',
        'contact_id',
        'organization_type_short_name',
        'organization_type_long_name',
));

$oContacts = null;
try
{
    $oContacts = new Contact_Juridical();
    $contact_id = $update_array['contact_id'];
    if(empty($contact_id))
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
