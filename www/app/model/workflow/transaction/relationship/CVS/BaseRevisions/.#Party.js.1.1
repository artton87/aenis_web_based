Ext.define('Aenis.model.workflow.transaction.relationship.Party', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.transaction.relationship.party.Right',
        'Aenis.model.workflow.transaction.relationship.party.Subject'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'rel_id', type: 'int'},
        {name: 'party_type_id', type: 'int'},
        {name: 'party_type_code', type: 'string'},
        {name: 'party_type_label', type: 'string'}
    ],

    hasMany:[
        {
            foreignKey: 'party_id',
            associationKey: 'subjects',
            name: 'subjects',
            model: 'Aenis.model.workflow.transaction.relationship.party.Subject'
        },
        {
            foreignKey: 'party_id',
            associationKey: 'rights',
            name: 'rights',
            model: 'Aenis.model.workflow.transaction.relationship.party.Right'
        }
    ],

    proxy: {
        type: 'ajax',

        reader: {
            type: 'json',
            root: 'data'
        },

        writer: {
            type: 'json',
            root: 'data',
            encode: true
        },

        api: {
            create: 'workflow/transaction/relationship/party/add_edit.php',
            read: 'workflow/transaction/relationship/party/parties.json.php',
            update: 'workflow/transaction/relationship/party/add_edit.php'
        }
    }
});
