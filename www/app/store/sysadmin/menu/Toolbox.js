Ext.define('Aenis.store.sysadmin.menu.Toolbox', {
    extend: 'Ext.data.TreeStore',
    requires: 'Aenis.model.sysadmin.menu.TreeItem',

    model: 'Aenis.model.sysadmin.menu.TreeItem',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: 'main/toolbox.json.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
