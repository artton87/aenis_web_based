Ext.define('Aenis.store.workflow.template.Variables', {
    extend: 'Ext.data.Store',
    requires: 'Aenis.model.workflow.template.Variable',

    model: 'Aenis.model.workflow.template.Variable',

    groupField: 'doc_type_id',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
