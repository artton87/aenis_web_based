Ext.define('Aenis.store.workflow.inheritance.Applications', {
    extend: 'Ext.data.Store',

    autoLoad: false,
    autoDestroy: true,

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},

        {type: 'int', name: 'notary_id'},
        {name: 'notary', type: 'string', persist: false},

        {name: 'transaction_code', type: 'string', persist: false},
        {name: 'locked_user_id', type: 'int'},

        {type:'string', name: 'case_code'},

        {name: 'relationships', type: 'auto'},
        {name: 'lu_user', type: 'string', persist: false},

        {name: 'tr_status_code', type: 'string'},
        {name: 'tr_status_title', type: 'string'},
        {name: 'lu_date', type: 'date'},

        {name: 'tr_type_id', type: 'int'},
        {name: 'tr_type_label', type: 'string'},

        {name: 'service_fee_coefficient_min', type: 'int'},
        {name: 'service_fee_coefficient_max', type: 'int'},

        {name: 'opening_notary', type: 'string'},
        {name: 'opening_notary_id', type: 'int'},

        {name: 'rateData', type:'auto'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'workflow/inheritance/application/applications.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        }
    }
});
