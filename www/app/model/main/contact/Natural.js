Ext.define('Aenis.model.main.contact.Natural', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {type: 'int', name: 'id'},
        {type: 'string', name: 'first_name'},
        {type: 'string', name: 'last_name'},
        {type: 'string', name: 'second_name'},
        {type: 'date', name: 'date_of_birth',dateFormat:'d/m/Y'},
        {type: 'string', name: 'social_card_number'},
        {type: 'string', name: 'passport_number'},
        {type: 'date',name:'given_date',dateFormat:'d/m/Y'},
        {type: 'string',name:'authority'},
        {type: 'string', name: 'country_label'},
        {type: 'int', name: 'country_id'},
        {type: 'string', name: 'zip'},
        {type: 'string', name: 'email'},
        {type: 'string', name: 'fax'},
        {type: 'string', name: 'phone_home'},
        {type: 'string', name: 'phone_office'},
        {type: 'string', name: 'phone_mobile'},
        {type: 'string', name: 'organization_name'},
        {type: 'string', name: 'staff_name'},
        {type: 'int', name: 'address_id'},
        {type: 'string', name: 'address', persist: false},
        {type: 'string', name: 'death_certificate'},
        {type: 'string', name: 'place_of_residence'}
    ],

    getName : function(){
        return this.get('first_name')+' '+this.get('second_name')+' '+this.get('last_name');
    },

    getServiceData: function(){
        return {
            "first_name": this.get('first_name'),
            "last_name": this.get('last_name'),
            "second_name": this.get('second_name'),
            "social_card_number": this.get('social_card_number'),
            "passport_number": this.get('passport_number'),
            "date_of_birth": Ext.Date.format(this.get('date_of_birth'), Ext.util.Format.dateFormat),
            "email": this.get('email'),
            "fax": this.get('fax'),
            "address": this.get('address'),
            "death_certificate": this.get('death_certificate'),
            "place_of_residence": this.get('place_of_residence'),
            "given_date": Ext.Date.format(this.get('given_date'), Ext.util.Format.dateFormat)
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
            create: 'main/contact/natural/add_edit.php',
            read:   'main/contact/natural/natural.json.php',
            update: 'main/contact/natural/add_edit.php'
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
