Ext.define('Aenis.model.workflow.subject.Relation', {
    extend: 'Ext.data.Model',

    idProperty: "subject_relation_id",

    fields: [
        {type: 'int', name: 'id'},
        {type: 'int', name: 'subject_relation_id'},
        {type: 'int', name: 'rel_type_id'},
        {type: 'string', name: 'label'},
        {type: 'string', name: 'contactName'},
        {type: 'auto', name: 'data'},
        {type: 'int', name: 'subject_id'},
        {type: 'int', name: 'tr_id'}
    ]

});
