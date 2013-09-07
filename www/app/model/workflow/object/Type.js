Ext.define('Aenis.model.workflow.object.Type', {
    extend: 'Ext.data.Model',

	requires: [
		'Aenis.model.workflow.object.type.Content'
	],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'label', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'order_in_list', type: 'int'},
        {name: 'parent_id', type: 'int'},
        {name: 'parent_label', type: 'string', persist: false},
        {name: 'hidden', type: 'boolean'},

		{name: 'contentData', type: 'auto'}
    ],

	hasMany:[
		{
			foreignKey: 'object_type_id',
			associationKey: 'content',
			name: 'content',
			model: 'Aenis.model.workflow.object.type.Content'
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
            create: 'workflow/object/type/add_edit.php',
            read: 'workflow/object/type/types.json.php',
            update: 'workflow/object/type/add_edit.php',
            destroy: 'workflow/object/type/delete.php'
        }
    }
});
