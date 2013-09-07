Ext.define('Aenis.model.workflow.subject.relation.Type', {
    extend: 'Ext.data.Model',

    idProperty: "id",

    fields: [
        {type: 'int', name: 'id'},
        {type: 'string', name: 'label'}
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
            create: 'workflow/subject/relation/type/add_edit.php',
            read: 'workflow/subject/relation/type/types.json.php',
            update: 'workflow/subject/relation/type/add_edit.php',
            destroy: 'workflow/subject/relation/type/delete.php'
        }
    }
});
