Ext.define('Aenis.model.main.contact.juridical.Type', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'name', type: 'string'},
        {name: 'abbreviation', type: 'string'}
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
            create: 'main/contact/juridical/type/add_edit.php',
            read: 'main/contact/juridical/type/types.json.php',
            update: 'main/contact/juridical/type/add_edit.php',
            destroy: 'main/contact/juridical/type/delete.php'
        }
    }
});
