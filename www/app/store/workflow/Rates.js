Ext.define('Aenis.store.workflow.Rates', {
    extend: 'Ext.data.Store',

    model: 'Aenis.model.workflow.Rate',

    autoLoad: false,
    autoSync: true,

	autoDestroy: true
});
