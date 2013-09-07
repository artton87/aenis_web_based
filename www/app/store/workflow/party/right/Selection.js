Ext.define('Aenis.store.workflow.party.right.Selection', {
    extend: 'Ext.data.Store',

    model: 'Aenis.model.workflow.transaction.relationship.party.Right',

    proxy: {
        type: 'memory'
    },

    autoSync: true
});
