Ext.define('Aenis.store.main.contact.Selection', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.main.contact.Selection',

    proxy: {
        type: 'memory'
    },

    autoSync: true,

    groupField: 'hash'
});
