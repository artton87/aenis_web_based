Ext.define('Aenis.store.sysadmin.menu.Tree', {
    extend: 'Ext.data.TreeStore',
    requires: 'Aenis.model.sysadmin.menu.TreeItem',

    model: 'Aenis.model.sysadmin.menu.TreeItem',

    root: {
        expanded: true,
        loaded: true
    },

    autoLoad: false
});
