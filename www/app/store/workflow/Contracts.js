Ext.define('Aenis.store.workflow.Contracts', {
    extend: 'Ext.data.Store',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'customer', type: 'string'},
        {name: 'app_date', type: 'string'},

        {name: 'tr_status_code', type: 'string'},
        {name: 'tr_status_title', type: 'string'},

        {name: 'transaction_code', type: 'string', persist: false},
        {type:'string', name: 'case_code'},

        {name: 'locked_user_id', type: 'int'},

        {name: 'notary', type: 'string'},
        {name: 'lu_user', type: 'string'},
        {name: 'lu_date', type: 'date'},

        {name: 'tr_type_id', type: 'int'},
        {name: 'tr_type_label', type: 'string'},

        {name: 'is_paid', type: 'boolean'},

        {name: 'service_fee_coefficient_min', type: 'int'},
        {name: 'service_fee_coefficient_max', type: 'int'},

        {name: 'rateData', type:'auto'}
    ],


    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'workflow/contract/contracts.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        }
    },

    autoLoad: false,
    autoDestroy: true
});
