Ext.define('Aenis.store.main.user.Grid', {
    extend: 'Ext.data.Store',
    requires: [
        'Aenis.model.main.user.GridItem'
    ],

    model: 'Aenis.model.main.user.GridItem',

    groupField: 'has_position',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
