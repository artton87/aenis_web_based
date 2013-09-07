Ext.define('Aenis.model.workflow.Transaction', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.transaction.Relationship',
        'Aenis.model.workflow.transaction.Property',
        'Aenis.model.workflow.subject.Relation'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'app_id', type: 'int'},
        {name: 'case_id', type: 'int'},


        {name: 'parent_id', type: 'int'},

        {name: 'notary_id', type: 'int'},
        {name: 'notary', type: 'string', persist: false},

        {name: 'tr_type_id', type: 'int'},
        {name: 'tr_type_label', type: 'string', persist: false},

        {name: 'locked_user_id', type: 'int'},
        {name: 'locked_user', type: 'string'},

        {name: 'lu_user_id', type: 'int'},
        {name: 'lu_user', type: 'string', persist: false},
        {name: 'lu_date', type: 'date', useNull: true},

        {name: 'del_user_id', type: 'int'},
        {name: 'del_user', type: 'string', persist: false},
        {name: 'del_date', type: 'date', useNull: true}
    ],


    hasMany:[
        {
            foreignKey: 'tr_id',
            associationKey: 'relationships',
            name: 'relationships',
            model: 'Aenis.model.workflow.transaction.Relationship'
        },
        {
            foreignKey: 'tr_id',
            associationKey: 'properties',
            name: 'properties',
            model: 'Aenis.model.workflow.transaction.Property'
        },
        {
            foreignKey: 'tr_id',
            associationKey: 'relations',
            name: 'relations',
            model: 'Aenis.model.workflow.subject.Relation'
        }
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'workflow/transaction/get_transaction_by_id.php'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
