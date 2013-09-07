Ext.define('Aenis.model.workflow.transaction.Relationship', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.transaction.relationship.Party',
        'Aenis.model.workflow.transaction.relationship.Object',
        'Aenis.model.workflow.Document'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'tr_id', type: 'int'}
    ],

    hasMany:[
        {
            foreignKey: 'rel_id',
            associationKey: 'parties',
            name: 'parties',
            model: 'Aenis.model.workflow.transaction.relationship.Party'
        },
        {
            foreignKey: 'rel_id',
            associationKey: 'objects',
            name: 'objects',
            model: 'Aenis.model.workflow.transaction.relationship.Object'
        },
        {
            foreignKey: 'rel_id',
            associationKey: 'documents',
            name: 'documents',
            model: 'Aenis.model.workflow.Document'
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
            create: 'workflow/transaction/relationship/add_edit.php',
            read: 'workflow/transaction/relationship/relationships.json.php',
            update: 'workflow/transaction/relationship/add_edit.php'
        }
    }
});
