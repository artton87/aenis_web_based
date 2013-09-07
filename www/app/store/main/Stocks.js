Ext.define('Aenis.store.main.Stocks', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.main.Stock',

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
            read: 'main/stocks/stocks.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});


