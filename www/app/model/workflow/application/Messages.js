Ext.define('Aenis.model.workflow.application.Messages', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'app_id', type: 'int'},
        {name: 'message_date', type: 'date'},
        {name: 'notary_id', type: 'int'},
        {name: 'customer_id', type: 'int'},
        {name: 'author', type: 'string', persist: false},
        {name: 'message', type:'string'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            create: 'workflow/application/messages/add_edit.php',
            read: 'workflow/application/messages/messages.json.php'
        },
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: true,
            root: 'data'
        }
    }
});
