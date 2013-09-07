<?php
user_auth_check();

$oInheritanceApplication = null;

if(!empty($_POST['death_certificate']))
    $search['death_certificate'] = $_POST['death_certificate'];

$oInheritanceApplication = new Inheritance_Applications();
$result = $oInheritanceApplication->getOpeningNotary($_POST);

if($row = $oInheritanceApplication->db_fetch_array($result))
{
    $items['notary_full_name'] = $row['notary_full_name'];
    $items['notary_id'] = $row['notary_id'];
    $items['residence_address'] = $row['residence_address'];
}


Ext::sendResponse(true,array(
    'data'=>$items
));
