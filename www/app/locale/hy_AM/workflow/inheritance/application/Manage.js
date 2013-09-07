Ext.define('Locale.hy_AM.workflow.inheritance.application.Manage', {
    constructor: function() {
        Ext.applyIf(this.translations["hy_AM"], {
            "transaction_type": "Գործարքի տեսակ",
            "transaction_type_select_tip": "Ընտրել ստեղծվող պայմանագրի գործարքի տեսակը",
            "viewTabTitle": "Ժառանգության դիմումի ստեղծում",
            "warrants": "Ժառանգական գործի դիմումներ",
            "properties": "Գործարքի ատրիբուտներ",
            "documents": "Գործարքի փաստաթղթեր",
            "leave_edit_mode": "Դուրս գալ խմբագրման ռեժիմից",
            "notary": "Նոտար",
            "firstTabTitle": "Կողմեր",
            "secondTabTitle": "Բովանդակություն, Փաստաթղթեր",
            "application_announcement": "",
            "parties": "Կողմեր",
            "party_type": "Կողմի տեսակ",
            "objects": "Օբյեկտ(ներ)",
            "msg_create_success": "Ժառանգության դիմումը մուտքագրված է",
            "msg_update_success": "Ժառանգության դիմումը խմբագրված է",
            "existing_subject": "Նշված սուբյեկտը արդեն ընտրված է",
            "msg_objects_empty": "Որևէ օբյեկտ ընտրված չէ",
            "msg_objects_invalid": "Օբյեկտների ոչ բոլոր տվայլներն են ընտրված",
            "msg_relationship_documents_invalid": "Փաստաթղթերի ոչ բոլոր տվայլներն են ընտրված",
            "msg_party_subjects_empty": "{0} կողմի սուբյեկտները ընտրված չեն",
            "msg_party_subjects_invalid": "{0} կողմի սուբյեկտների ոչ բոլոր տվայլներն են ընտրված",
            "msg_required_property_missing": "\"{0}\" ատրիբուտի արժեքը նշված չէ",
            "reset_view_action":"Դուրս գալ դիտման ռեժիմից",
            "view_complete_document":"Դիտել ավարտական փաստաթուղթը",
            "address_check":"Մահացածի գրանցման հասցեն համընկնում է հաշվառման հասցեի հետ",
            "select_address":"Ընտրեք հասցե",
            "region":"Մարզ",
            "community":"Համայնք",
            "search_notary":"Գտնել նոտար",
            "opening_notary":"Գործը բացող նոտար",
            "place_of_residence":"Հաշվառման հասցե"
        });
    }
});
