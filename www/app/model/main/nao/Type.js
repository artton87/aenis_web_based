Ext.define('Aenis.model.main.nao.Type', {
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
            create: 'main/nao/type/add_edit.php',
            read: 'main/nao/type/types.json.php',
            update: 'main/nao/type/add_edit.php',
            destroy: 'main/nao/type/delete.php'
        }
    }
});
