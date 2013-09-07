Ext.define('Aenis.model.workflow.Document', {
    extend: 'Ext.data.Model',
    requires: [
		'Aenis.model.workflow.Page',
		'Aenis.model.workflow.document.File'
    ],
    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
		{name: 'case_id', type: 'int'},
		{name: 'doc_id', type: 'int'},
        {name: 'rel_id', type: 'int'},
        {name: 'object_id', type: 'int'},
		{name: 'subject_id', type: 'int'},
		{name: 'doc_type_id', type: 'int'},
		{name: 'tr_type_id', type: 'int'},
		{name: 'doc_type_label', type: 'string', persist:false},
        {name: 'doc_num_in_case', type: 'int'},
		{name: 'page_count', type: 'int'},
		{name: 'document_description', type: 'string'},
		{name: 'has_file', type: 'int'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            create: 'workflow/document/add_edit.php',
            read: 'workflow/document/documents.json.php',
            update: 'workflow/document/add_edit.php',
			destroy: 'workflow/document/delete.php'
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
    },

    hasMany: [
        {
            foreignKey: 'doc_id',
            associationKey: 'pages',
            model: 'Aenis.model.workflow.Page',
            name: 'pages'
        },
        {
            foreignKey: 'doc_id',
            associationKey: 'files',
            name: 'files',
            model: 'Aenis.model.workflow.document.File'
        }
    ]
});
