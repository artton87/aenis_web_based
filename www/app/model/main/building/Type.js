Ext.define('Aenis.model.main.building.Type', {
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
            create: 'main/building/type/add_edit.php',
            read: 'main/building/type/types.json.php',
            update: 'main/building/type/add_edit.php',
            destroy: 'main/building/type/delete.php'
        }
    }
});
