Ext.define('Aenis.store.main.Vehicles', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.main.Vehicle',

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
            read: 'main/vehicle/vehicles_from_service.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});


