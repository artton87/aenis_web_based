<?php
class SignatureValidation{

	const PKSERV_URL = 'http://www.e-gov.am/V1-SIGN-P/';
	const PKSERV_LICENSE = 'c4b11c35a414504254ec656864dc3e7b';

	/*
	const SAPI_ENUM_DRAWING_ELEMENT_GRAPHICAL_IMAGE = 0x00000001;
	const SAPI_ENUM_DRAWING_ELEMENT_SIGNED_BY = 0x00000002;
	const SAPI_ENUM_DRAWING_ELEMENT_REASON
		  = 0x00000004;
	const SAPI_ENUM_DRAWING_ELEMENT_TIME
		  = 0x00000008;
	const SAPI_ENUM_DRAWING_ELEMENT_TITLE
		  = 0x00000020;
	const SAPI_ENUM_DRAWING_ELEMENT_ADDITIONAL_TXT = 0x00000020;
	const SAPI_ENUM_DRAWING_ELEMENT_LOGO
		  = 0x00000040;
	const SAPI_ENUM_DRAWING_ELEMENT_SUGGESTED_TITLE = 0x00000080;
	const SAPI_ENUM_DRAWING_ELEMENT_INITIALS = 0x40000000;

	const AR_PDF_FLAG_FILESIGN_LINE = 0x00000010;
	const AR_PDF_FLAG_FILESIGN_VERTICAL = 0x00000020;

	
	
	static function sign_and_verify_pdf($file_name, $user_name, $password, $passport, $soc_card = ''){
		
		$f = fopen($file_name, 'r+');
		if (!$f)
			throw new Exception('[System] File not found');
			flock($f, LOCK_EX);
		try
		{
			$pdf_tail = self::sign_pdf($f, self::get_sig_field(-1), $user_name, $password);
			$pkey = self::extract_pkey_from_pdf_tail($pdf_tail);
			
			if (!self::verify_user_pkey($pkey, $passport, $soc_card))
				throw new Exception('Public key does not correspond to the passport number, signing aborted');
			if (fseek($f, 0, SEEK_END) != 0)
				throw new Exception('[System] File seek failed');
			if (!fwrite($f, $pdf_tail))
				throw new Exception('[System] Signature append failed');
		}
		catch (Exception $e)
		{
			flock($f, LOCK_UN);
			fclose($f);
			throw $e;
		}
		flock($f, LOCK_UN);
		fclose($f);
		return $pkey;
		
	}
	
	
	static function seal_pdf($f, $sig_field){
		
		if (is_string($f)){
			 $fpdf = fopen($f, 'r+');
			 flock($fpdf, LOCK_EX);
		}
		else
			$fpdf = $f;
			
		$pdf_tail = self::sign_pdf($fpdf, $sig_field, self::EREG_SIGN_USER_NAME, self::EREG_SIGN_PASSWORD);
		
		if (fseek($fpdf, 0, SEEK_END) != 0)
			throw new Exception('[System] File seek failed');
			
		if (!fwrite($fpdf, $pdf_tail))
			throw new Exception('[System] Signature append failed');
			
		if (is_string($f)){
			 flock($fdest, LOCK_UN);
			 fclose($fpdf);
		}
	}
	
	static function sign_pdf($f, $sig_info, $user_name, $password){
		
		// $f - file handle, possibly locked, pointer at the beginning
		// $sig_info - SAPISigFieldSettingsType object, see get_sig_field()

		$unsigned_data = '';
		while ($s = fread($f, 8192))
		$unsigned_data .= $s;
		unset($s);

		$req->SignRequest->OptionalInputs->ClaimedIdentity->Name->_ = $user_name;
		$req->SignRequest->OptionalInputs->ClaimedIdentity->SupportingInfo->LogonPassword = $password;

		if (is_object($sig_info))
		{
		$req->SignRequest->OptionalInputs->SignatureType = 'http://arx.com/SAPIWS/DSS/1.0/signature-field-create-sign';
		$req->SignRequest->OptionalInputs->SAPISigFieldSettings = $sig_info;
		}
		else // if (is_string($sig_info))
		{
		$req->SignRequest->OptionalInputs->SignatureType = 'http://arx.com/SAPIWS/DSS/1.0/signature-field-sign';
		$req->SignRequest->OptionalInputs->SignatureFieldName = $sig_info;
		}

		$req->SignRequest->OptionalInputs->ReturnPDFTailOnly = true;

		$req->SignRequest->InputDocuments->Document->Base64Data->MimeType = 'application/pdf';
		$req->SignRequest->InputDocuments->Document->Base64Data->_ = $unsigned_data;

		$result = self::_dss_request('DssSign', $req);

		if (!isset($result->DssSignResult->SignatureObject->Base64Signature->_))
		throw new Exception('DSS Error: unrecognized response from the server');

		return $result->DssSignResult->SignatureObject->Base64Signature->_;
	}
	
	static function get_sig_field($page = -1, $x = 250, $y = 100, $w = 75, $h = 75){
	
		$s->TimeFormat->DateFormat = 'dd/MM/yyyy';
		$s->TimeFormat->TimeFormat = 'HH:mm:ss';
		$s->ExtTimeFormat = 'GMT';
		$s->SignatureType = 'Digital';
		$s->Invisible = $page < 0;
		if (!$s->Invisible)
		{
		$s->X = $x;
		$s->Y = $y; // from the bottom of the page
		$s->Width = $w;
		$s->Height = $h;
		$s->AppearanceMask =
		self::SAPI_ENUM_DRAWING_ELEMENT_GRAPHICAL_IMAGE
		// | self::SAPI_ENUM_DRAWING_ELEMENT_SIGNED_BY 
		// | self::SAPI_ENUM_DRAWING_ELEMENT_TIME 
		// | self::SAPI_ENUM_DRAWING_ELEMENT_TITLE 
		;
		$s->LabelsMask = $s->AppearanceMask;
		$s->Flags = 0; // self::AR_PDF_FLAG_FILESIGN_LINE;
		}
		$s->Page = $page;
		return $s;
	}
	
	static function _dss_request($method, $arg){
	
		$client = new SoapClient('https://ca.gov.am:8080/SAPIWS/dss.asmx?WSDL');
		$result = $client->$method($arg);
		$r = $result->{"{$method}Result"};
		if (!isset($r->Result)
		|| !preg_match('/:Success$/', $r->Result->ResultMajor))
		throw new Exception('DSS Error: ' . $r->Result->ResultMessage->_
		. " [{$r->Result->ResultMajor}]");
		return $result;
		
	}

	
	*/
	
	static function pem2der($pem){
		// Carefuly here: any data is allowed before and after the BEGIN ... END
		// lines in principle, which this function can't handle
		
		return base64_decode(implode('', array_slice(explode("\n", $pem), 1, -2)));
	}
	 
	static function verify_user_pkey($pkey, $passport, $ssn = ''){
		
		// $passport = preg_replace('/^([A-Z]{2})/', '$1 ', $passport);
		$request['psp'] = $passport;
		$request['key'] = bin2hex($pkey);
		$request['soc_card'] = $ssn;
		$request['license'] = self::PKSERV_LICENSE;
		if(!function_exists ('curl_init'))
			throw new App_Exception('CURL cannot be found or is not installed');
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, self::PKSERV_URL);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $request);
		$result = curl_exec($curl);
		curl_close($curl);
		return $result == 1;
	}
	
	static function extract_pkey_from_pdf_tail($pdf_tail){
	                     
		if (!preg_match('|/Adobe.PPKMS[[:space:]]*/Contents[[:space:]]*<([0-9A-F]+)>|', $pdf_tail, $matches))
			return false;
			//throw new Exception('[System] Certificate not found in PDF');
		
		$p7 = self::der2pem(pack('H*', $matches[1]));

		$cert = `echo "$p7" | openssl pkcs7 -print_certs 2>/dev/null`;

		if (!$cert)
			return false;
			//throw new Exception('[System] Unable to extract certificate');
		
		return self::pem2der(self::extract_pkey_from_cert($cert));
	}
	
	static function der2pem($der){
		
		return "-----BEGIN CERTIFICATE-----\n"
		. chunk_split(base64_encode($der), 64, "\n")
		. "-----END CERTIFICATE-----\n";
	}
	
	 // in PEM format
	static function extract_pkey_from_cert($cert){

		$key = openssl_pkey_get_details(openssl_pkey_get_public($cert));

		if (!$key)
			return false;
			//throw new Exception('[System] Unable to extract public key from cert');
		return $key['key'];
	}
	
}

 ?>
