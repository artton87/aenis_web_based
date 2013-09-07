Ext.define('Aenis.model.workflow.transaction.relationship.party.Subject', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.transaction.relationship.party.subject.Agent',
        'Aenis.model.workflow.Document'
    ],

    idProperty: "id",

    fields: [
        {type: 'int', name: 'id'},
        {type: 'int', name: 'party_id'},
        {type: 'int', name: 'n_contact_id'},
        {type: 'int', name: 'j_contact_id'},
        {type: 'string', name: 'contact_type', persist: false}, //either 'natural' or 'juridical'
        {type: 'string', name: 'contact_name', persist: false},
        {type: 'auto', name: 'serviceData'}
    ],

    hasMany:[
        {
            foreignKey: 'subject_id',
            associationKey: 'agents',
            name: 'agents',
            model: 'Aenis.model.workflow.transaction.relationship.party.subject.Agent'
        },
        {
            foreignKey: 'subject_id',
            associationKey: 'documents',
            name: 'documents',
            model: 'Aenis.model.workflow.Document'
        }
    ]
});
