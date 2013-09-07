Ext.define('Aenis.model.workflow.transaction.property.type.Value', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'tr_property_type_id', type: 'int'},
        {name: 'label', type: 'string'}
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
            create: 'workflow/transaction/property/type/value/add_edit.php',
            read: 'workflow/transaction/property/type/value/values.json.php',
            update: 'workflow/transaction/property/type/value/add_edit.php',
            destroy: 'workflow/transaction/property/type/value/delete.php'
        }
    }
});
