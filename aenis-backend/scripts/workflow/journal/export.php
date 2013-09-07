<?php

$phpExcel = new PHPExcel();

$styleArray = array(
    'font' => array(
        'bold' => true,
    )
);

//Get the active sheet and assign to a variable
$list = $phpExcel->getActiveSheet();

//add column headers, set the title and make the text bold
$list->setCellValue("A1", "Գործարքի կոդ")
    ->setCellValueExplicit("B1", "Նոտարական գործողության\n կատարման  ամսաթիվը,\n ամիսը, տարեթիվը")
    ->setCellValueExplicit("C1", "Անձանց և նրանց ներկայացուցիչների\n անունը, ազգանունը,
                                  հայրանունը\n և բնակաության վայրը,\n որոց համար կատարված է\n նոտարական գործողությունը")
    ->setCellValue("D1", "Նոտարական գործողությունների\n բովանդակություն")
    ->setCellValue("E1", "Նոտարական գործողությունների կատարմանը\n մասնակցող անձանց ինքնությունը\n հաստատող փաստաթղթերը")
    ->setCellValueExplicit("F1", "Գանձված է\n միասնական պետական տուրք\n կամ նշում պետական\n տուրքից ազատման մասին")
    ->setCellValue("G1", "Վճարովի ծառայություններից ստացված եկամուտի գումարը")
    ->getStyle("A1:G1")->applyFromArray($styleArray);

$search = array();

$oTransaction = new Transactions();

$oTransactionRelationship = new Transaction_Relationships();
$oParty = new Transaction_Relationship_Parties();
$oSubject = new Transaction_Relationship_Party_Subjects();
$transactionsResult = $oTransaction->getTransactions($search, $start, $limit);
$items = array();
$i = 1;
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


    /*$i++;
    $list->setCellValue("A$i", $transactionsList['transaction_code'])
        ->setCellValue("B$i",  $transactionsList['tr_creation_date'])
        ->setCellValue("C$i", $contacts)
        ->setCellValue("D$i", $transactionsList['tr_type_label'])
        ->setCellValue("E$i", $documents)
        ->setCellValue("F$i", $transactionsList["state_fee_coefficient"])
        ->setCellValue("G$i", $transactionsList["service_fee_coefficient_min"]);*/


}
//Logger::out($items);


$i = 1;

foreach ($items as $item)
{
    $contacts = array();
    $documents = array();
    foreach($item['relationships'] as $key => $value)
    {

        foreach($value as $val)
        {
            $contacts[] = $val['contactName'];
            $documents[] = $val['serviceData']['passport_number'];
        }

    }
    $contact = implode(', ', $contacts);
    $document = implode(', ', $documents);

    $i++;
    $list->setCellValue("A$i", $item['transaction_code'])
        ->setCellValue("B$i",  $item['tr_creation_date'])
        ->setCellValue("C$i", $contact)
        ->setCellValue("D$i", $item['tr_type_label'])
        ->setCellValue("E$i", $document)
        ->setCellValue("F$i", $item["state_fee_coefficient"])
        ->setCellValue("G$i", $item["service_fee_coefficient_min"]);
    $list->getStyle("A$i")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
    $list->getStyle("A$i:G$i")->getAlignment()->setWrapText(true);
}



//Set the column widths
$list->getColumnDimension("A")->setWidth(20);
$list->getColumnDimension("B")->setWidth(20);
$list->getColumnDimension("C")->setWidth(50);
$list->getColumnDimension("D")->setWidth(50);
$list->getColumnDimension("E")->setWidth(30);
$list->getColumnDimension("F")->setWidth(30);
$list->getColumnDimension("G")->setWidth(20);

$phpExcel->setActiveSheetIndex(0);

header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=\"journal.xls\"");
header("Cache-Control: max-age=0");

$objWriter = PHPExcel_IOFactory::createWriter($phpExcel, "Excel5");
$objWriter->save("php://output");
exit;









