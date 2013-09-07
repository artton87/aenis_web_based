Ext.define('Aenis.store.workflow.transaction.property.Types', {
    extend: 'Ext.data.Store',
    requires: 'Aenis.model.workflow.transaction.property.Type',

    model: 'Aenis.model.workflow.transaction.property.Type',

    autoLoad: false,
    autoSync: true
});
