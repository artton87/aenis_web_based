Ext.define('Aenis.model.workflow.document.File', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'file_name', type: 'string'},
        {name: 'file_path', type: 'string'},
        {name: 'doc_id', type: 'int'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'workflow/document/files.json.php'
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
