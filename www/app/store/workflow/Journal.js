Ext.define('Aenis.store.workflow.Journal', {
    extend: 'Ext.data.Store',

    autoLoad: false,
    autoDestroy: true,

    idProperty: 'id',


    fields: [
        {name: 'id', type: 'int'},

        {type: 'int', name: 'notary_id'},
        {name: 'notary', type: 'string', persist: false},

        {name: 'transaction_code', type: 'string', persist: false},
        {type:'string', name: 'case_code'},

        {name: 'relationships', type: 'auto'},
        {name: 'input_user', type: 'string', persist: false},

        {name: 'tr_status_code', type: 'string'},
        {name: 'tr_status', type: 'string'},
        {name: 'tr_creation_date', type: 'date'},

        {name: 'tr_type_id', type: 'int'},
        {name: 'tr_type_label', type: 'string'},

        {name: 'state_fee_coefficient', type: 'int'},
        {name: 'service_fee_coefficient_min', type: 'int'},
        {name: 'service_fee_coefficient_max', type: 'int'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'workflow/journal/journal.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
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
