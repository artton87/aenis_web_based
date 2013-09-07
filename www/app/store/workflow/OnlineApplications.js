Ext.define('Aenis.store.workflow.OnlineApplications', {
    extend: 'Ext.data.Store',

    autoLoad: false,
    autoDestroy: true,
    pageSize: 10,

    idProperty: 'id',

    fields: [
        {type: 'int', name: 'id'},
        {type: 'int', name: 'app_id'},
        {type: 'int', name: 'tr_type_id'},
        {type: 'string', name: 'application_type', persist: false},
        {type: 'int', name: 'notary_id'},
        {type: 'string', name: 'notary'},
        {type: 'int', name: 'customer_id'},
        {type: 'string', name: 'customer'},
        {type: 'string', name: 'status'},
        {type: 'string', name: 'tr_status_code'},
        {type: 'int', name: 'tr_status_id'},
        {type: 'string', name: 'input_date'},
        {type: 'string', name: 'ui_type'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            update:'workflow/onlineApplications/approve.php',
            read: 'workflow/onlineApplications/onlineApplications.json.php'
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