<?php
/**
 * @package aenis\library
 */


/**
 * A class, which simplifies working with cURL
 * @author BestSoft
 * @package aenis\library
 */
class Curl
{
    /**
     * Send a GET request using CURL
     * @param string $url to request
     * @param array $get values to send
     * @param array $options for CURL
     * @return string
     */
    static function curl_get($url, array $get = NULL, array $options = array()) {
        $defaults = array(
            CURLOPT_URL => $url . (strpos($url, '?') === FALSE ? '?' : '') . http_build_query($get),
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_FOLLOWLOCATION => TRUE
        );

        $ch = curl_init();
        curl_setopt_array($ch, ($options + $defaults));
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    /**
     * Send a POST requst using CURL
     * @param string $url to request
     * @param array or string $vars values to send
     * @param array $options for CURL
     * @return string
     */
    static function curl_post($url, $vars = NULL, array $options = array()) {

        $defaults = array(
            CURLOPT_URL => $url,
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => $vars
        );

        $ch = curl_init();
        curl_setopt_array($ch, ($options + $defaults));

        if( ! $result = curl_exec($ch))
        {
            trigger_error(curl_error($ch));
        }

        //$result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    /**
     * Transfer file using CURL
     * @param string $path destination file path
     * @param file_pointer_resource  $fp
     * @param array $options for CURL
     * @return string
     */
    static function transferFile($fp, $path, array $options = array())
    {
        $defaults = array(
            CURLOPT_TIMEOUT => 50,
            CURLOPT_FILE => $fp,
            CURLOPT_FOLLOWLOCATION => TRUE
        );
        $ch = curl_init('http://' . $path);
        curl_setopt_array($ch, ($options + $defaults));
        if( ! $result = curl_exec($ch))
        {
            trigger_error(curl_error($ch));
        }
        curl_close($ch);
    }

}
