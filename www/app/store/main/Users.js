Ext.define('Aenis.store.main.Users', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.main.User',
    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
