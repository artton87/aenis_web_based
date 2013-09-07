Ext.define('Aenis.store.workflow.relationship.Subjects', {
    extend: 'Ext.data.ArrayStore',
    model: 'Aenis.model.workflow.transaction.relationship.party.Subject',
    autoLoad: false,
    autoDestroy: true,
    autoSync: true
});
