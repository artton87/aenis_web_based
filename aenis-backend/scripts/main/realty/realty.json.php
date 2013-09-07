<?php
user_auth_check();

$certificate_number = $_POST['certificate_number'];

$oItems = new Objects();

$items = array();
$realty = $oItems->getRealtyDetails($certificate_number);
if(null !== $realty)
{

    $attributes = $realty['data']['item']['@attributes'];
    $items[] = array(
        'id' => $attributes[''],
        'certificate_number' => $attributes['certificate_number'],
        'given_date' => App_Date::isoDateTime2Str($attributes['given_date'],true),
        'address' => $attributes['address'],
        'parcel_codes' => $attributes['parcel_codes'],
        'building_codes' => $attributes['building_codes'],
        'building_type' => $attributes['building_type'],
        'parcel_total_area' => $attributes['parcel_total_area'],
        'building_total_area' => $attributes['building_total_area'],
    );
}

Ext::sendResponse(true, array(
    'data' => $items
));