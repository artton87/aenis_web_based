<?php
/**
 * Verifies signature of file, which was signed by Cosign
 * @package Framework\Validate
 */


/**
 * Validator for checking whenever file contains valid Cosign signature
 * @package Framework\Validate
 */
class App_Validate_File_Signature_Cosign extends App_Validate_Abstract
{
	const PKSERV_URL = 'http://www.e-gov.am/V1-SIGN-P/';
	const PKSERV_LICENSE = 'c4b11c35a414504254ec656864dc3e7b';


	/**
	 * @var string    Passport number
	 */
	protected $_passport_number = '';

	/**
	 * @var string    Social card number
	 */
	protected $_social_card_number = '';


	/**
	 * Constructor. Sets default values.
	 * @access public
	 * @param string $passport_number    Passport number
	 * @param string $social_card_number    Social card number
	 * @param string $message    A message to be returned in case of error
	 */
	public function __construct($passport_number, $social_card_number, $message = null)
	{
		parent::__construct($message);
		$this->setPassportNumber($passport_number);
		$this->setSocialCardNumber($social_card_number);
	}


	/**
	 * Sets passport number
	 * @access public
	 * @param string $passport_number    Passport number
	 */
	public function setPassportNumber($passport_number)
	{
		$this->_passport_number = $passport_number;
	}


	/**
	 * Sets social card number
	 * @access public
	 * @param string $social_card_number    Social card number
	 */
	public function setSocialCardNumber($social_card_number)
	{
		$this->_social_card_number = $social_card_number;
	}


	/**
	 * Returns passport number
	 * @access public
	 * @return string
	 */
	public function getPassportNumber()
	{
		return $this->_passport_number;
	}


	/**
	 * Returns social card number
	 * @access public
	 * @return string
	 */
	public function getSocialCardNumber()
	{
		return $this->_social_card_number;
	}


	/**
	 * Checks if uploaded file has an allowed extension
	 * @access public
	 * @param string $file_key    Key of $_FILES array to be tested
	 * @throws App_Exception if passport number was not set up
	 * @return boolean    True - if has, false - otherwise
	 */
	public function isValid($file_key)
	{
		if(empty($this->_passport_number))
			throw new App_Exception('Passport number is not provided to cosign PDF file signature validator.');
		$file_content = file_get_contents($_FILES[$file_key]['tmp_name']);
		$p_key = $this->extract_pkey_from_pdf_tail($file_content);
		if($p_key && $this->verify_user_pkey($p_key, $this->_passport_number, $this->_social_card_number))
		{
			return true;
		}
		return false;
	}



	protected function verify_user_pkey($pkey, $passport, $ssn = '')
	{
		// $passport = preg_replace('/^([A-Z]{2})/', '$1 ', $passport);
		$request['psp'] = $passport;
		$request['key'] = bin2hex($pkey);
		$request['soc_card'] = $ssn;
		$request['license'] = self::PKSERV_LICENSE;

		if(!function_exists('curl_init'))
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


	protected function extract_pkey_from_pdf_tail($pdf_tail)
	{
		if (!preg_match('|/Adobe.PPKMS[[:space:]]*/Contents[[:space:]]*<([0-9A-F]+)>|', $pdf_tail, $matches))
			return false; // Certificate not found in PDF

		$p7 = $this->der2pem(pack('H*', $matches[1]));

		if(strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
		{
			$temp_file_name = tempnam(App_File_Transaction::getTempDirectory(), "openssl");
			file_put_contents($temp_file_name, $p7);
			$in_arg = escapeshellarg($temp_file_name);
			$cert = shell_exec('openssl pkcs7 -in "'.$in_arg.'" -print_certs');
			unlink($temp_file_name);
		}
		else
		{
			$cert = shell_exec('echo "'.$p7.'" | openssl pkcs7 -print_certs 2>/dev/null');
		}

		if (!$cert)
			return false; // Unable to extract certificate from PDF file

		return $this->pem2der($this->extract_pkey_from_cert($cert));
	}


	protected function extract_pkey_from_cert($cert)
	{
		$key = openssl_pkey_get_details(openssl_pkey_get_public($cert));
		if(!$key)
			return false; // Unable to extract public key from certificate
		return $key['key'];
	}


	protected function der2pem($der)
	{
		$pem = chunk_split(base64_encode($der), 64, "\n");
		$pem = "-----BEGIN CERTIFICATE-----\n".$pem."-----END CERTIFICATE-----\n";
		return $pem;
	}


	protected function pem2der($pem)
	{
		// Carefully here: any data is allowed before and after the BEGIN ... END
		// lines in principle, which this function can't handle
		return base64_decode(implode('', array_slice(explode("\n", $pem), 1, -2)));
	}
}
