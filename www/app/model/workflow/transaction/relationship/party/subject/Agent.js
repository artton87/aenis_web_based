Ext.define('Aenis.model.workflow.transaction.relationship.party.subject.Agent', {
    extend: 'Ext.data.Model',

    idProperty: "id",

    fields: [
        {type: 'int', name: 'id'},
        {type: 'int', name: 'subject_id'},
        {type: 'int', name: 'n_contact_id'},
        {type: 'string', name: 'agent_position'},
        {type: 'string', name: 'contact_name', persist: false}
    ]
});
