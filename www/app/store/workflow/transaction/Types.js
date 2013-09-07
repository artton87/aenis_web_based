Ext.define('Aenis.store.workflow.transaction.Types', {
    extend: 'Ext.data.TreeStore',
    requires: 'Aenis.model.workflow.transaction.type.TreeItem',

    model: 'Aenis.model.workflow.transaction.type.TreeItem',

    root: {
        expanded: true,
        loaded: true
    },

    autoLoad: false
});
