Ext.define('Aenis.model.workflow.transaction.type.party.Type', {
    extend: 'Ext.data.Model',

    idProperty: 'party_type_id',

    fields: [
        {name: 'tr_type_id', type: 'int'},
        {name: 'party_type_id', type: 'int'},
        {name: 'is_required', type: 'boolean'},
        {name: 'order_in_list', type: 'int'},
        {name: 'party_type_label', type: 'string', persist: false},
        {name: 'parent_party_type_id', type: 'int'}
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
            create: 'workflow/transaction/type/party/type/add_edit.php',
            read: 'workflow/transaction/type/party/type/types.json.php',
            update: 'workflow/transaction/type/party/type/add_edit.php',
            destroy: 'workflow/transaction/type/party/type/delete.php'
        }
    }
});
