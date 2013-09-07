Ext.define('Aenis.store.workflow.file.Selection', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.workflow.file.Selection',

    proxy: {
        type: 'memory'
    },

    autoSync: true
});
