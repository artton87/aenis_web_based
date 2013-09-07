Ext.define('Aenis.store.workflow.transaction.Statuses', {
    extend: 'Ext.data.Store',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'workflow/transaction/statuses.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },

    autoLoad: false,
    autoDestroy: true


});

