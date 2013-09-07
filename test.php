<?php

 $wsdl = 'http://192.168.1.53/aenis_web_based/Service1.svc.xml?WSDL';

        $trace = true;
        $exceptions = true;
        $client = new SoapClient($wsdl, array('trace' => $trace, 'exceptions' => $exceptions));
        $xml_array['Paspn'] = 'AG0468182';

        try
        {
            $client = new SoapClient($wsdl, array('trace' => $trace, 'exceptions' => $exceptions));
            $response = $client->AVVFIND_PERSON_XML($xml_array);
			
		}

        catch (Exception $e)
        {
            echo "Error!";
            echo $e -> getMessage ();
            echo 'Last response: '. $client->__getLastResponse();
        }


        $response1 = $response->AVVFIND_PERSON_XMLResult;
        //Logger::out($response1);

        echo "<pre>";print_r($response1);

        //echo"---------------<br>";


        $xml = simplexml_load_string($response1);
        //print_r($xml);
        //echo "<br>";

        //foreach( $xml as $response )
        //{
          //  echo ': '.$response.'<br />';
        //}
//foreach($obj->PaspN as $row)
//{
        echo $xml->PaspN . "\n";