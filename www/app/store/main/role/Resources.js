Ext.define('Aenis.store.main.role.Resources', {
	extend: 'Ext.data.Store',

    model: 'Aenis.model.main.role.Resource',

    groupField: 'type_label',

    autoLoad: false,
    autoSync: false
});
 

