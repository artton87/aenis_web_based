Ext.define('Aenis.model.workflow.party.Type', {
    extend: 'Ext.data.Model',

	requires: [
		'Aenis.model.workflow.party.type.Content'
	],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'label', type: 'string'},
        {name: 'party_type_code', type: 'string'},

		{name: 'contentData', type: 'auto'}
    ],

	hasMany:[
		{
			foreignKey: 'party_type_id',
			associationKey: 'content',
			name: 'content',
			model: 'Aenis.model.workflow.party.type.Content'
		}
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
            create: 'workflow/party/type/add_edit.php',
            read: 'workflow/party/type/types.json.php',
            update: 'workflow/party/type/add_edit.php',
            destroy: 'workflow/party/type/delete.php'
        }
    }
});
