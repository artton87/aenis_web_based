Ext.define('Aenis.model.main.house.Type', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
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
            create: 'main/house/type/add_edit.php',
            read: 'main/house/type/types.json.php',
            update: 'main/house/type/add_edit.php',
            destroy: 'main/house/type/delete.php'
        }
    }
});
