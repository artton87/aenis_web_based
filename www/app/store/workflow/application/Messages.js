Ext.define('Aenis.store.workflow.application.Messages', {
    extend: 'Ext.data.Store',

    model:'Aenis.model.workflow.application.Messages',

    //pageSize: 10,

    autoLoad: false,
    autoDestroy: true,
    //autoSync: true,

    sorters: [{
        property: 'id',
        direction: 'ASC'
    }]


});
