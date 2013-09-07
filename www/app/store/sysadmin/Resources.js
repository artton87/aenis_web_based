Ext.define('Aenis.store.sysadmin.Resources', {
	extend: 'Ext.data.Store',

    model: 'Aenis.model.sysadmin.Resource',

    groupField: 'type_label',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
