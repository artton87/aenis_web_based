Ext.define('Aenis.store.workflow.NotarialOffices', {
    extend: 'Ext.data.Store',

    model: 'Aenis.model.workflow.NotarialOffice',

    groupField: 'region_title',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
