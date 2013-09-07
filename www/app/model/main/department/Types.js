Ext.define('Aenis.model.main.department.Types', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'title', type: 'string'}
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
            create: 'main/department/type/add_edit.php',
            read: 'main/department/type/types.json.php',
            update: 'main/department/type/add_edit.php',
            destroy: 'main/department/type/delete.php'
        }
    }
});
