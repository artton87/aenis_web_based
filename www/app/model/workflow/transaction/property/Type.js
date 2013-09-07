Ext.define('Aenis.model.workflow.transaction.property.Type', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.transaction.property.type.Value'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'label', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'typeValuesData', type: 'auto', useNull: true}
    ],

    hasMany:[
        {
            foreignKey: 'tr_property_type_id',
            associationKey: 'typeValues',
            name: 'typeValues',
            model: 'Aenis.model.workflow.transaction.property.type.Value'
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
            create: 'workflow/transaction/property/type/add_edit.php',
            read: 'workflow/transaction/property/type/types.json.php',
            update: 'workflow/transaction/property/type/add_edit.php',
            destroy: 'workflow/transaction/property/type/delete.php'
        }
    }
});
