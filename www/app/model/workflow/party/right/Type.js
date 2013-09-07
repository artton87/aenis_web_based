Ext.define('Aenis.model.workflow.party.right.Type', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'label', type: 'string'}
    ],

    proxy: {
        type: 'ajax',

        reader: {
            type: 'json',
            root: 'data'
        },

        writer: {
            type: 'json',
            root: 'data',
            encode: true
        },

        api: {
            create: 'workflow/party/right/type/add_edit.php',
            read: 'workflow/party/right/type/types.json.php',
            update: 'workflow/party/right/type/add_edit.php',
            destroy: 'workflow/party/right/type/delete.php'
        }
    }
});
