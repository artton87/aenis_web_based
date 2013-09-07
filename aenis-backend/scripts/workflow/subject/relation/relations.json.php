<?php
user_auth_check();

$search['transaction_id'] = $_POST['transaction_id'];


$oSubjectRelation = new Transaction_Relationship_Party_Subject_Relations();

$subjectRelationResult = $oSubjectRelation->getSubjectRelations($search);

$items = array();

while($row= $oSubjectRelation->db_fetch_array($subjectRelationResult))
{
    if(!empty($row['n_contact_name']))
        $contactName = $row['n_contact_name'];
    if(!empty($row['j_contact_name']))
        $contactName = $row['j_contact_name'];

    $items[] = array(
        'subject_relation_id' => $row['subject_relation_id'],
        'rel_type_id' => $row['rel_type_id'],
        'subject_id' => $row['subject_id'],
        'label' => $row['rel_type_label'],
        'contactName' => $contactName
    );
}

Ext::sendResponse(true, array(
    'data' => $items
));
