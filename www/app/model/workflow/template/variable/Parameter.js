Ext.define('Aenis.model.workflow.template.variable.Parameter', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.template.variable.parameter.Value'
    ],

    idProperty: 'name',

    fields: [
        {name: 'name', type: 'string'},
        {name: 'display_name', type: 'string'},
        {name: 'is_required', type: 'boolean'},
        {name: 'value', type: 'auto'},
        {name: 'template_variable_id', type: 'int'}
    ],

    hasMany:[
        {
            foreignKey: 'parameter_name',
            associationKey: 'acceptableValues',
            name: 'acceptableValues',
            model: 'Aenis.model.workflow.template.variable.parameter.Value'
        }
    ],

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            read: 'workflow/template/variable/parameter/parameters.json.php'
        }
    }
});
