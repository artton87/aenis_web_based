Ext.define('Locale.hy_AM.workflow.inheritance.components.Form', {
    constructor: function() {
        Ext.applyIf(this.translations["hy_AM"], {
            "first_name": "Անուն",
            "last_name": "Ազգանուն",
            "second_name": "Հայրանուն",
            "passport_number": "Անձնագիր",
            "social_card_number": "Սոցիալական քարտ",
            "first_name_is_empty":"Լրացրեք ժառանգորդի անունը",
            "last_name_is_empty":"Լրացրեք ժառանգորդի ազգանունը",
            "second_name_is_empty":"Լրացրեք ժառանգորդի հայրանունը",
            "social_card_number_is_empty":"Լրացրեք սոց. քարտի համարը",
            "passport_number_is_empty":"Լրացրեք անձնագիրը",
            "fallback_message": "Լրացրեք կամ անուն/ազգանունը, կամ անձնագրի համարը, կամ սոց. քարտի համարը",
            "death_certeficate":"Մահվան վկայական"
        });
    }
});
