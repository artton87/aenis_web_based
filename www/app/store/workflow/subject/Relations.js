Ext.define('Aenis.store.workflow.subject.Relations', {
    extend: 'Ext.data.Store',
    model: 'Aenis.model.workflow.subject.Relation',
    autoLoad: false,

    groupField: 'subject_relation_id'
});
