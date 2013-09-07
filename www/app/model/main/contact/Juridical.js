Ext.define('Aenis.model.main.contact.Juridical', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {type: 'int', name: 'id'},
        {type: 'string', name: 'organization_name'},
        {type: 'string', name: 'organization_type'},
        {type: 'int', name: 'organization_type_id'},
        {type: 'string', name: 'registration_number'},
        {type: 'string', name: 'tax_account'},
        {type: 'date', name: 'foundation_date',dateFormat:'d/m/Y'},
        {type: 'string', name: 'certificate_number'},
        {type: 'string', name: 'phone'},
        {type: 'string', name: 'fax'},
        {type: 'string', name: 'website'},
        {type: 'string', name: 'email'},
        {type: 'string', name: 'country_label'},
        {type: 'int', name: 'country_id'},
        {type:'string',name:'address'},
        {type: 'int', name: 'address_id'},
        {type: 'string', name: 'additional_information'},
        {type: 'string', name: 'address'},
        {type: 'boolean', name: 'is_verified'}
    ],

    getName: function(){
        return this.get('organization_name');
    },

    getServiceData: function(){
        return {
            "organization_name": this.get('organization_name'),
            "registration_number":  this.get('registration_number'),
            "tax_account": this.get('tax_account'),
            "address":this.get('address')
        }
    },

    proxy: {
        type: 'ajax',
        actionMethods: {
            create:'POST',
            update: 'POST',
            read: 'POST'
        },
        api: {
            create: 'main/contact/juridical/add_edit.php',
            read:   'main/contact/juridical/juridical.json.php',
            update: 'main/contact/juridical/add_edit.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: true,
            root: 'data'
        }
    }
});
