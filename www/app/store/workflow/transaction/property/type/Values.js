Ext.define('Aenis.store.workflow.transaction.property.type.Values', {
    extend: 'Ext.data.Store',
    requires: 'Aenis.model.workflow.transaction.property.type.Value',

    model: 'Aenis.model.workflow.transaction.property.type.Value',

    autoLoad: false,
    autoSync: true
});
