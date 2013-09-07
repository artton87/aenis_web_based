Ext.define('Aenis.model.workflow.Case', {
    extend: 'Ext.data.Model',
    requires: [
		'Aenis.model.workflow.Document'
    ],
    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
		{name: 'case_code', type: 'string'},
		{name: 'notary_id', type: 'int'},
        {name: 'is_all_scanned', type: 'boolean'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            create: 'workflow/case/add_edit.php',
            read: 'workflow/case/getCases.json.php',
            update: 'workflow/case/add_edit.php'
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
    },

	associations: [{
		type: 'hasMany',
		model: 'Aenis.model.workflow.Document',
		foreignKey: 'case_id',
		name: 'documents'
	}]
});
