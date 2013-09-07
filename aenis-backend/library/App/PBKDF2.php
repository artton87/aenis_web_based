<?php
/**
 * PBKDF2 (Password-Based Key Derivation Function 2) implementation
 * @author Algorithm by havoc@defuse.ca
 * @link https://defuse.ca/php-pbkdf2.htm
 * @package Framework\Security
 */

 
/**
 * Contains PBKDF2 (Password-Based Key Derivation Function 2) 
 * implementation and methods for secure hashing and hash checking
 * @package Framework\Security
 */
class App_PBKDF2
{
	/**
	 * Default salt length
	 * @access protected
	 * @var integer
	 */
	protected $_pbkdf2_salt_bytes = 24;
	
	/**
	 * Default hash length
	 * @access protected
	 * @var integer
	 */
	protected $_pbkdf2_hash_bytes = 24;
	
	/**
	 * Default hash algorithm
	 * @access protected
	 * @var integer
	 */
	protected $_pbkdf2_hash_algorithm = 'sha256';
	
	/**
	 * Default number of iterations for PBKDF2 algorithm
	 * @access protected
	 * @var integer
	 */
	protected $_pbkdf2_iterations = 1000;
	
	
	/**
	 * Constructor
	 * @access public
	 * @param string $hash_algorithm    New hash algorithm
	 * @param integer $salt_bytes    New value for salt length
	 * @param integer $hash_bytes    New value for hash length
	 * @param integer $iterations    Number of iterations for the PBKDF2 algorithm 
	 * @return App_PBKDF2
	 */
	public function __construct($hash_algorithm = 'sha256', $salt_bytes = 24, $hash_bytes = 24, $iterations = 100)
	{
		$this->setHashAlgorithm($hash_algorithm);
		$this->setSaltBytes($salt_bytes);
		$this->setHashBytes($hash_bytes);
		$this->setIterations($iterations);
	}
	
	
	/**
	 * Sets salt length
	 * @access public
	 * @param integer $salt_bytes    New value for salt length
	 */
	public function setSaltBytes($salt_bytes)
	{
		$this->_pbkdf2_salt_bytes = $salt_bytes;
	}
	
	/**
	 * Returns salt length
	 * @access public
	 * @return integer    Salt length
	 */
	public function getSaltBytes()
	{
		return $this->_pbkdf2_salt_bytes;
	}
	
	
	/**
	 * Sets hash length
	 * @access public
	 * @param integer $hash_bytes    New value for hash length
	 */
	public function setHashBytes($hash_bytes)
	{
		$this->_pbkdf2_hash_bytes = $hash_bytes;
	}
	
	/**
	 * Returns hash length
	 * @access public
	 * @return integer    Hash length
	 */
	public function getHashBytes()
	{
		return $this->_pbkdf2_hash_bytes;
	}
	
	
	/**
	 * Sets hash algorithm
	 * @access public
	 * @param string $hash_algorithm    New hash algorithm
	 */
	public function setHashAlgorithm($hash_algorithm)
	{
		$this->_pbkdf2_hash_algorithm = $hash_algorithm;
	}
	
	/**
	 * Returns hash algorithm
	 * @access public
	 * @return string    Hash algorithm
	 */
	public function getHashAlgorithm()
	{
		return $this->_pbkdf2_hash_algorithm;
	}
	
	
	/**
	 * Sets number of iterations for the PBKDF2 algorithm
	 * @access public
	 * @param integer $iterations    Number of iterations for the PBKDF2 algorithm 
	 */
	public function setIterations($iterations)
	{
		$this->_pbkdf2_iterations = $iterations;
	}
	
	/**
	 * Returns number of iterations for the PBKDF2 algorithm
	 * @access public
	 * @return integer     Number of iterations for the PBKDF2 algorithm 
	 */
	public function getIterations()
	{
		return $this->_pbkdf2_iterations;
	}
	

	/**
	 * Create hash from a given string
	 * @access public
	 * @param string $password   A string
	 * @return string    A prepared hash
	 */
	public function create_hash($password)
	{
		// format: salt:hash
		$salt = base64_encode($this->random_string($this->_pbkdf2_salt_bytes));
		return $salt . ':' .
			base64_encode(
				$this->pbkdf2(
					$this->_pbkdf2_hash_algorithm,
					$password,
					$salt,
					$this->_pbkdf2_iterations,
					$this->_pbkdf2_hash_bytes,
					true
				)
			);
	}
	
	
	/**
	 * Generates random string of a given length
	 * @access public
	 * @param integer $len   A string length
	 * @return string    A random string
	 */
	public function random_string($len)
	{
		$s = '';
		if(function_exists('mcrypt_create_iv'))
		{
			$s = mcrypt_create_iv($len, MCRYPT_DEV_URANDOM);
		}
		else
		{
			
			$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			$chars_max_index = strlen($chars)-1;
			for($i=0; $i<$len; $i++)
			{
				$s .= $chars[mt_rand(0, $chars_max_index)];
			}
		}
		return $s;
	}
	
	
	/**
	 * Validates given password with the given hash
	 * @access public
	 * @param string $password
	 * @param string $good_hash
	 * @throws App_Exception if given hash is invalid
	 * @return boolean
	 */
	public function validate_password($password, $good_hash)
	{
		$vec = explode(':', $good_hash);
		if(count($vec)<2)
			throw new App_Exception('Invaid hash given');
		
		$salt = $vec[0];
		$pbkdf2 = base64_decode($vec[1]);
		
		return $this->slow_equals(
			$pbkdf2,
			$this->pbkdf2(
				$this->_pbkdf2_hash_algorithm,
				$password,
				$salt,
				$this->_pbkdf2_iterations,
				strlen($pbkdf2),
				true
			)
		);
	}
	
	
	/**
	 * Compares two strings $a and $b in length-constant time.
	 * @access protected
	 * @param string $a
	 * @param string $b
	 * @return boolean    True - if strings are equal, false - otherwise
	 */
	protected function slow_equals($a, $b)
	{
	    $diff = strlen($a) ^ strlen($b);
	    for($i = 0; $i < strlen($a) && $i < strlen($b); $i++)
	    {
	    	$diff |= ord($a[$i]) ^ ord($b[$i]);
	    }
	    return $diff === 0; 
	}
	

	/**
	 * PBKDF2 key derivation function as defined by RSA's PKCS #5: https://www.ietf.org/rfc/rfc2898.txt
	 * $algorithm - The hash algorithm to use. Recommended: SHA256
	 * $password - The password.
	 * $salt - A salt that is unique to the password.
	 * $count - Iteration count. Higher is better, but slower. Recommended: At least 1000.
	 * $key_length - The length of the derived key in bytes.
	 * $raw_output - If true, the key is returned in raw binary format. Hex encoded otherwise.
	 * Returns: A $key_length-byte key derived from the password and salt.
	 *
	 * Test vectors can be found here: https://www.ietf.org/rfc/rfc6070.txt
	 *
	 * This implementation of PBKDF2 was originally created by https://defuse.ca
	 * With improvements by http://www.variations-of-shadow.com
	 * 
	 * @param string $algorithm
	 * @param string $password
	 * @param string $salt
	 * @param integer $count
	 * @param integer $key_length
	 * @param boolean $raw_output    Optional. If true, returns outut as string, otherwise returns bin2hex applied value
	 * @throws App_Exception if invalid parameters are given
	 * @return string    A $key_length-byte key derived from the password and salt.
	 */
	public function pbkdf2($algorithm, $password, $salt, $count, $key_length, $raw_output = false)
	{
	    $algorithm = strtolower($algorithm);
	    if(!in_array($algorithm, hash_algos(), true))
	        throw new App_Exception('PBKDF2 ERROR: Invalid hash algorithm.');
	    if($count <= 0 || $key_length <= 0)
	        throw new App_Exception('PBKDF2 ERROR: Invalid parameters.');

	    $hash_length = strlen(hash($algorithm, "", true));
	    $block_count = ceil($key_length / $hash_length);

	    $output = "";
	    for($i = 1; $i <= $block_count; $i++) {
	        // $i encoded as 4 bytes, big endian.
	        $last = $salt . pack("N", $i);
	        // first iteration
	        $last = $xorsum = hash_hmac($algorithm, $last, $password, true);
	        // perform the other $count - 1 iterations
	        for ($j = 1; $j < $count; $j++) {
	            $xorsum ^= ($last = hash_hmac($algorithm, $last, $password, true));
	        }
	        $output .= $xorsum;
	    }

	    if($raw_output)
	        return substr($output, 0, $key_length);
	    else
	        return bin2hex(substr($output, 0, $key_length));
	}
}
