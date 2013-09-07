Ext.define('Aenis.model.main.nao.SubType', {
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
            create: 'main/nao/subtype/add_edit.php',
            read: 'main/nao/subtype/types.json.php',
            update: 'main/nao/subtype/add_edit.php',
            destroy: 'main/nao/subtype/delete.php'
        }
    }
});
