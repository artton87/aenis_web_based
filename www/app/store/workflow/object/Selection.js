Ext.define('Aenis.store.workflow.object.Selection', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.workflow.transaction.relationship.Object',

    proxy: {
        type: 'memory'
    },

    autoSync: true,

    groupField: 'hash'
});
