Ext.define('Aenis.model.workflow.Template', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'content', type: 'string', useNull:true},
        {name: 'is_common_template', type: 'boolean'},
        {name: 'doc_type_id', type: 'int'},
        {name: 'doc_type_label', type: 'string', persist: false},
        {name: 'definer_user_id', type: 'int'},
        {name: 'definer_user_full_name', type: 'string', persist: false}
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
            create: 'workflow/template/add_edit.php',
            read: 'workflow/template/templates.json.php',
            update: 'workflow/template/add_edit.php',
            destroy: 'workflow/template/delete.php'
        }
    }
});
