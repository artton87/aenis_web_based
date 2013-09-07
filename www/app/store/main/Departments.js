Ext.define('Aenis.store.main.Departments', {
    extend: 'Ext.data.TreeStore',
    requires: 'Aenis.model.main.department.TreeItem',

	model: 'Aenis.model.main.department.TreeItem',

    root: {
        expanded: true,
        loaded: true
    },

    autoLoad: false
});
