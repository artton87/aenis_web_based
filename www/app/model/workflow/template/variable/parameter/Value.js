Ext.define('Aenis.model.workflow.template.variable.parameter.Value', {
    extend: 'Ext.data.Model',

    idProperty: 'value',

    fields: [
        {name: 'value', type: 'string'},
        {name: 'display_name', type: 'string'},
        {name: 'parameter_name', type: 'string'}
    ]
});
