Ext.define('Aenis.store.main.user.Notaries', {
    extend: 'Ext.data.Store',

    model: 'Aenis.model.main.user.GridItem',

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'data'
        },
        api: {
            read: 'main/user/notaries.json.php'
        }
    },

    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
