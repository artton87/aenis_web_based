Ext.define('Aenis.model.workflow.Page', {
    extend: 'Ext.data.Model',
    requires: [

    ],
    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
		{name: 'page_id', type: 'int'},
		{name: 'doc_id', type: 'int'},
		{name: 'file_id', type: 'int'},
		{name: 'page_number_in_document', type: 'int'},
		{name: 'page_format_id', type: 'int'},
		{name: 'page_file', type: 'string'},
		{name: 'page_size', type: 'string', persist:false}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'workflow/document/page/getPages.json.php'
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
