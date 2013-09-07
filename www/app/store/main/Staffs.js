Ext.define('Aenis.store.main.Staffs', {
    extend: 'Ext.data.TreeStore',
    requires: 'Aenis.model.main.staff.TreeItem',

	model: 'Aenis.model.main.staff.TreeItem',

    root: {
        expanded: true,
        loaded: true
    },

    autoLoad: false
});
