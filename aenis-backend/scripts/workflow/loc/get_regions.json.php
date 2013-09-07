<?php
user_auth_check();

$oLanguages = new Languages();
$default_lang_id = $oLanguages->getDefaultLanguage()->id;
$oLocation = new Location();
$regions = $oLocation->getRegions($default_lang_id);

Ext::sendResponse(true, array(
    'data' => $regions
));
