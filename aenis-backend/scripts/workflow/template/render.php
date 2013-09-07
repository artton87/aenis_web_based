<?php
user_auth_check();

$oSession = App_Registry::get('temp_sn');
$key_length = 32;
$collection_key = 'template.render';

try{
	if(1 == $_POST['init'])
	{
		//generate HTML
		$html = $_POST['html'];
		if(1 != $_POST['previewMode'])
		{
			$oTemplates = new Templates();
			$html = $oTemplates->getHTML($html);
		}

		//generate HTML
		$key = substr(str_pad(md5(time().$oSession->user_id),$key_length,'x'), 0, $key_length);
		$oSession->setItem($key, new App_Session_Item_Object($html), $collection_key);
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
$html = $oSession->getItem($key, $collection_key);
if(null === $html) //key is missing
{
	echo 'Ֆայլի դիտումը արգելված է';
	exit;
}
$oSession->unsetItem($key, $collection_key);

$pdf = Template_TCPDF::getTCPDFObject('Նախնական դիտում');
$pdf->AddPage();
$pdf->writeHTML($html);
$pdf->Output('preview.pdf', 'I');
