Ext.define('Aenis.store.main.Countries', {
    extend: 'Ext.data.Store',

    model: 'Aenis.model.main.Country',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
