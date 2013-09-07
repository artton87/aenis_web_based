<?php

user_auth_check(true);
if(Acl()->allowed('application.add'))
{

    $oTransaction = new Transactions();

    $file = $oTransaction->getFinishDocumentFullPath($_POST['code'],$_POST['pass']);

    $image_content = file_get_contents($file);
    $image_content = chunk_split(base64_encode($image_content));

    echo $image_content;


}
else
{
    Ext::sendErrorResponse('Դուք չունեք բավարար իրավունքներ դիմում ավելացնելու համար:');
}