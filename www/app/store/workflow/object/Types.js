Ext.define('Aenis.store.workflow.object.Types', {
    extend: 'Ext.data.TreeStore',
    requires: 'Aenis.model.workflow.object.type.TreeItem',

    model: 'Aenis.model.workflow.object.type.TreeItem',

    root: {
        expanded: true,
        loaded: true
    },

    autoLoad: false
});
