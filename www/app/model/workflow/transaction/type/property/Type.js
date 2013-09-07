Ext.define('Aenis.model.workflow.transaction.type.property.Type', {
    extend: 'Ext.data.Model',

    idProperty: 'property_type_id',

    fields: [
        {name: 'tr_type_id', type: 'int'},
        {name: 'property_type_id', type: 'int'},
        {name: 'is_required', type: 'boolean'},
        {name: 'order_in_list', type: 'int'},
        {name: 'property_type_label', type: 'string', persist: false},
        {name: 'property_type', type: 'string', persist: false},
        {name: 'property_type_code', type: 'string', persist: false}
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
            create: 'workflow/transaction/type/property/type/add_edit.php',
            read: 'workflow/transaction/type/property/type/types.json.php',
            update: 'workflow/transaction/type/property/type/add_edit.php',
            destroy: 'workflow/transaction/type/property/type/delete.php'
        }
    }
});
