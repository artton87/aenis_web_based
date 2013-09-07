Ext.define('Aenis.model.workflow.template.Variable', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.template.variable.Parameter'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'doc_type_id', type: 'int'},
        {name: 'doc_type_label', type: 'string', persist: false},
        {name: 'is_dynamic', type: 'boolean'},
        {name: 'has_parameters', type: 'boolean'}
    ],

    hasMany:[
        {
            foreignKey: 'template_variable_id',
            associationKey: 'parameters',
            name: 'parameters',
            model: 'Aenis.model.workflow.template.variable.Parameter'
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
            create: 'workflow/template/variable/add_edit.php',
            read: 'workflow/template/variable/variables.json.php',
            update: 'workflow/template/variable/add_edit.php',
            destroy: 'workflow/template/variable/delete.php'
        }
    }
});
