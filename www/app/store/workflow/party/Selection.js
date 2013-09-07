Ext.define('Aenis.store.workflow.party.Selection', {
    extend: 'Ext.data.Store',

    model: 'Aenis.model.workflow.transaction.relationship.Party',

    autoLoad: false,
    autoDestroy: true
});
