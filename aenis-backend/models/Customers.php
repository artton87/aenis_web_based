<?php

class Customers extends Files {

    /**
     * Get customer row by customer id
     * 
     * @param type $id
     */
    public function getCustomer($id)
    {
        $query = "SELECT username,name,last_name FROM bs_customers WHERE id='$id' LIMIT 1";
        $result = $this->db_query($query);
        while($row = $this->db_fetch_array($result))
        {
            $customers[] = $row;
        }
        return $customers[0];
    }

        public function addCustomer($data) {
        $dba = $this->getAdapter();
        $dba->insert('customers', $data);
        return $dba->insert_id();
    }

    public function activateCustomer($key) {
        $response = array();
        $dba = $this->getAdapter();
        $query = $dba->select('customers', array('id', 'username', 'active'), array('activation_key' => $key));
        if (!$dba->num_rows($query)) {
            $response['status'] = 2; // NO USER WITH SUCH ACTIVATION KEY
        } else {
            $result = $dba->fetch_array($query);
            if ($result['active']) {
                $response['status'] = 3; // ACCOUNT IS ALLREADY ACTIVE
            } else {
                $dba->update('customers', array('active' => 1), array('id' => $result['id']));
                $response['status'] = 1; //ACCOUNT HAS BEEN ACTIVATED
            }
            $response['email'] = $result['username'];
            $dba->commit();
        }
        return $response;
    }

    public function getCustomers($search = array()) {
    	$dba = $this->getAdapter();
        $where = array();
        if (!empty($search['keywords'])) {
            foreach ($search['keywords'] as $keyword) {
                if (trim($keyword == ""))
                    continue;

                $where[] = '
                         CONCAT(
                                c.`last_name`, 
                                c.`name` ,  
                                c.`middle_name`, 
                                c.`username`, 
                                c.`passport_series`, 
                                c.`passport_num`,
                                c.`soc_cart`
                                ) LIKE \'%' . trim($keyword) . '%\'';
            }
        }
        
        if(!empty($search['id']))
        	$where[] = 'c.id = '.$dba->escape_string($search['id']);
        if(!empty($search['username']))
            $where[] = 'username = "'.$dba->escape_string($search['username']).'"';
        if(!empty($search['password']))
        	$where[] = 'pw = '.md5($dba->escape_string($search['password']));

        if (!empty($where)) {
            $where = 'WHERE ' . implode(' AND ', $where);
        } else {
            $where = '';
        }
        $dba = $this->getAdapter();
        $query = 'SELECT
                        c.`id`,
                        CONCAT(c.`last_name`, " ", c.`name`, " ", c.`middle_name`) AS full_name,
        				c.`name`, c.`middle_name`, c.`last_name`,
                        c.`username` AS email,
                        c.`soc_cart`,
                        CONCAT(c.`passport_series`, " ", c.`passport_num`) AS passport,
                        c.`tel`,
                        CONCAT(f.`file_path`, f.`file_name`) AS file,
                        c.`active`,
        				c.`activation_key`
                    FROM
                        `bs_customers` AS c LEFT JOIN `bs_files` AS f ON c.`file_id` = f.`id`
					' . $where . '
                    ORDER BY
                        c.`last_name` ASC,
                        c.`middle_name` ASC,
                        c.`name` ASC
                    ';


        $q_result = $dba->query($query);

        if ($dba->num_rows($q_result))
        {
	        for ($i = 0; $i < $dba->num_rows($q_result); $i++)
	        {
	            $row = $dba->fetch_array($q_result);
	            $result[$i] = $row;
	        }
            return $result;
        }
        else
        {
        	return false;
        }
    }
	/*
    public function getCustomerById($id) {
        $dba = $this->getAdapter();
        $query = $dba->select('customers', array('*'), array('id' => $id));
        if ($dba->num_rows($query)) {
            return $dba->fetch_array($query);
        }
        return false;
    }

    public function getCustomerByUsername($username) {
        $dba = $this->getAdapter();
        $query = $dba->select('customers', array('*'), array('username' => $username));
        if ($dba->num_rows($query)) {
            return $dba->fetch_array($query);
        }
        return false;
    }

    public function toggleCustomerActive($id, $active) {
        $dba = $this->getAdapter();
        $dba->update('customers', array('active' => $active), array('id' => $id));
        return $dba;
    }
    */

    public function removeCustomer($id) {
        $dba = $this->getAdapter();
        $query = $dba->select('customers', array('file_id'), array('id' => $id));
        $res = $dba->fetch_array($query);
        if (!empty($res['file_id'])) {
            $this->delete($res['file_id']);
        }
        $dba->delete('customers', array('id' => $id));
        return $dba;
    }

    /*
    public function sendMail($to, $from, $subject, $body, $attachment = array()) {

        $mailer = new PHPMailer();
        $mailer->AddAddress($to);
        $mailer->AddReplyTo($from);
        $mailer->SetFrom($from, 'enotary.am');
        $mailer->IsHTML();
        $mailer->Subject = $subject;
        if (!empty($attachment))
            $mailer->AddAttachment($attachment['full_path'], $attachment['name']);
        $mailer->Body = $body;
        return $mailer->Send();
    }
    
    public function checkCredentials($username, $password) {

        $result = $this->db_select(
                'customers', array('id', 'file_id', 'name', 'last_name', 'active'), array(
            'username' => array('value' => "'" . $this->db_escape_string($username) . "'", 'escape' => false),
            'pw' => md5($password)
                )
        );

        if ($this->db_num_rows($result) == 1) {
            return $this->db_fetch_array($result);
        }
        return '';
    }

    public function getCustomerDetails($customer_id) {
        if (empty($customer_id))
            return '';

        $dba = $this->getAdapter();

        $query = '
				SELECT bs_customers.*
				FROM `bs_customers`
				WHERE `bs_customers`.id = ' . intval($customer_id) . '
				';

        return $dba->query($query);
    }
	*/

    public function updateCustomers($data, $conditions) {
        $dba = $this->getAdapter();
        $dba->update('customers', $data,  $conditions);
    }

    public function createRandomPassword($length) {
        $chars = "234567890abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $i = 0;
        $password = "";
        while ($i <= $length) {
            $password .= $chars{mt_rand(0, strlen($chars))};
            $i++;
        }
        return $password;
    }
}
