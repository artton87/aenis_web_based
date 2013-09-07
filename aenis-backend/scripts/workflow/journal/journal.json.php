<?php
user_auth_check();

$start = (!empty($_POST['start'])) ? $_POST['start'] : 0;
$limit = (!empty($_POST['limit'])) ? $_POST['limit'] : 0;
$init = (!empty($_POST['init'])) ? $_POST['init'] : 0;

//session object
$oSession = App_Registry::get('temp_sn');

//Page id, used to distinguish between sessions
$session_collection_key = 'search_journal_'.$_POST['view_uid'];

if(1 == $init) //if init=1 found in request, reset session
{
    //unset search parameters
    $oSession->unsetCollection($session_collection_key);

    //set search parameters into session
    if(!empty($_POST['params']))
    {
        $params = App_Json::decode($_POST['params'],true);
        $oSession->setItem('params', new App_Session_Item_Object($params), $session_collection_key);
    }
}

//get search parameters from session
$search = array();

$oTransaction = new Transactions();

$oTransactionRelationship = new Transaction_Relationships();
$oParty = new Transaction_Relationship_Parties();
$oSubject = new Transaction_Relationship_Party_Subjects();
$transactionsResult = $oTransaction->getTransactions($search, $start, $limit);
$items = array();

while($transactionsList = $oTransaction->db_fetch_array($transactionsResult))
{
    $relationships = array();
    $relationshipsResult = $oTransactionRelationship->getRelationships(array('transaction_id' => $transactionsList['id']));
    while($relationshipsList = $oTransaction->db_fetch_array($relationshipsResult))
    {
        $partyResult = $oParty->getParties(array('relationship_id'=>$relationshipsList['id']));
        while($partyList = $oTransaction->db_fetch_array($partyResult))
        {
            $subjectsResult  = $oSubject->getSubjects(array('party_id'=>$partyList['id']));
            $relationships[$partyList['party_type_code']] = array();
            while($subjectList = $oTransaction->db_fetch_array($subjectsResult))
            {
                if(!empty($subjectList['n_contact_id']))
                {
                    $contactName = $subjectList['n_contact_name'];
                    $serviceData = array(
                        'passport_number' => $subjectList['n_passport_number']
                    );
                }

                elseif(!empty($subjectList['j_contact_id']))
                {
                    $contactName = $subjectList['j_contact_name'];
                    $serviceData = array(
                        'tax_account' => $subjectList['tax_account']
                    );
                }

                $relationships[$partyList['party_type_code']][]= array(
                    'id' => $subjectList['id'],
                    'n_contact_id' => $subjectList['n_contact_id'],
                    'j_contact_id' => $subjectList['j_contact_id'],
                    'contactName' => $contactName,
                    'serviceData'=> $serviceData
                );
            }
        }
    }

    $items[] = array(
        'id' => $transactionsList['id'],
        'relationships' => $relationships,
        'notary' => $transactionsList['notary'],
        'input_user' => $transactionsList['input_user'],
        'tr_creation_date' => $transactionsList['lu_date'],
        'case_code' => $transactionsList['case_code'],
        'tr_status_code' => $transactionsList['tr_status_code'],
        'tr_status' => $transactionsList['tr_status_title'],
        'transaction_code' => $transactionsList['transaction_code'],
        'tr_type_id' => $transactionsList['tr_type_id'],
        'tr_type_label'=> $transactionsList['tr_type_label'],
        'state_fee_coefficient' => $transactionsList['state_fee_coefficient'],
        'service_fee_coefficient_min' => $transactionsList['service_fee_coefficient_min'],
        'service_fee_coefficient_max' => $transactionsList['service_fee_coefficient_max']
    );

}
if($init == 1)
{
    $total = $oWarrant->getTransactions($search, 0, 0, true);
    $oSession->setItem('total', new App_Session_Item_Object($total), $session_collection_key);
}
else
{
    $total = $oSession->getItem('total', $session_collection_key);
}
Ext::sendResponse(true, array(
    'data' => $items,
    'total' => $total
));
