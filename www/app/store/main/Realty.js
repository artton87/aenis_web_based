Ext.define('Aenis.store.main.Realty', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.main.Realty',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true,
    pageSize: 10,

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'main/realty/realty.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});


