<?php
user_auth_check();

$oInheritance = null;

try {
    $id = $_POST['id'];

    $data = App_Json::decode($_POST['data'], true);
    $update_array = App_Array::pick($data,
        'content',
        'notary_id',
        'parties',
        'objects',
        'relationship_documents',
        'tr_type_id',
        'parent_id'
    );

    //Logger::out($update_array);


    if(empty($id))
    {
        if(Acl()->denied('inheritance.add'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ժառանգության գործի ավելացման համար:');

        $oInheritance = new Inheritances();
        $id = $oInheritance->addInheritance($update_array);
    }
    else
    {
        if(Acl()->denied('inheritance.edit'))
            throw new App_Exception_Permission('Դուք չունեք բավարար իրավունքներ ժառանգության գործի խմբագրման համար:');

        $oInheritance = new Inheritances();
        $id = $oInheritance->updateInheritance($id, $update_array);
    }

    $oInheritance->db_commit();

    Ext::sendResponse(true, array(
        'data' => array('id'=>$id)
    ));
}
catch(App_Exception_NonCritical $e)
{
    if(null!==$oInheritance) $oInheritance->db_rollback();
    Ext::sendErrorResponse($e->getMessage());
}
