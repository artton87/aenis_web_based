Ext.define('Aenis.store.workflow.notarial_office.Grid', {
    extend: 'Ext.data.Store',
    requires: [
        'Aenis.model.workflow.notarial_office.GridItem'
    ],

    model: 'Aenis.model.workflow.notarial_office.GridItem',

    groupField: 'region_title',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
