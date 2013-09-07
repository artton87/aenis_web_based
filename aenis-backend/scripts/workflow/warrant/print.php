<?php
user_auth_check();

$oSession = App_Registry::get('temp_sn');
$key_length = 32;
$collection_key = 'warrant.render';
$oWarrant = null;
try{
    if(1 == $_POST['init'])
    {
        $data = App_Array::pick($_POST, 'transaction_id');

        $oWarrant = new Warrants();

        $transaction_code_property =  $oWarrant->getTransactionPropertyValue($data['transaction_id'], 'transaction_code');
        $transaction_code = $transaction_code_property['label'].': '.$transaction_code_property['value'];

        $transaction_password_property =  $oWarrant->getTransactionPropertyValue($data['transaction_id'], 'transaction_password');
        $transaction_password = $transaction_password_property['label'].': '.$transaction_password_property['value'];

        $transaction_content_property =  $oWarrant->getTransactionPropertyValue($data['transaction_id'], 'template_content');
        $contentText = $transaction_content_property['value'];

        $content = '';
        $content .= $transaction_code.PHP_EOL.'<br />'.$transaction_password.PHP_EOL.''.$contentText;

        //generate HTML
        $oTemplates = new Templates();
        $html = $oTemplates->getHTML($content, $data);


        //store generated data to session
        $key = substr(str_pad(md5(time().$oSession->user_id),$key_length,'x'), 0, $key_length);
        $oSession->setItem($key, new App_Session_Item_Object(array(
            'html' => $html,
            'transaction_id' => $transaction_id
        )), $collection_key);


        Ext::sendResponse(true, array('key'=>$key));
        exit;
    }
}
catch(App_Exception_NonCritical $e)
{
    Ext::sendErrorResponse($e->getMessage());
    exit;
}

//check for key in session
$key = $_REQUEST['key'];
$data = $oSession->getItem($key, $collection_key);
if(null === $data) //key is missing
{
    header("Content-type: text/html; charset=utf-8");
    echo 'Ֆայլի տպելը արգելված է';
    exit;
}
$oSession->unsetItem($key, $collection_key);

//output PDF
$pdf = Template_TCPDF::getTCPDFObject('Լիազորագիր');
$pdf->AddPage();
$pdf->writeHTML($data['html']);
$pdf->writeHTML($transaction_code_property['value']);
$pdf->write2DBarcode('http://e-notary.am/application/docview/code/'.$transaction_code_property['value'].'', 'QRCODE,L', 150, 230, 30, 30, $style, 'N');
$pdf->Output('warrant_'.$data['transaction_id'].'.pdf', 'I');
