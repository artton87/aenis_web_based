Ext.define('Aenis.model.workflow.transaction.relationship.party.Right', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'party_id', type: 'int'},
        {name: 'party_right_type_id', type: 'int'},
        {
            name: 'party_right_type_label',
            type: 'string',
            convert: function(v) {
                return v.substr(0,1).toUpperCase() + v.substr(1);
            }
        }
    ]
});
