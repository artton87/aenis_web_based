<?php
user_auth_check(true);
if(Acl()->allowed('application.add'))
{

    $oFile = new Files();

    $file = $oFile->getFile($_POST['id']);

    $file = CFG_FILE_STORAGE.$file['path'].$file['file_path'].$file['file_name'];

    $image_content = file_get_contents($file);
    $image_content = chunk_split(base64_encode($image_content));
    echo $image_content;
    /*Ext::sendResponse(true, array(
        'data' => $image_content
    ));*/
}
else
{
    Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ դիմում ավելացնելու համար:');
}