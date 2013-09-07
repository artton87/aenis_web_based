Ext.define('Aenis.store.main.Shares', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.main.Share',

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
            read: 'main/share/shares.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});


