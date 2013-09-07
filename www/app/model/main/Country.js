Ext.define('Aenis.model.main.Country', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'name', type: 'string'},
        {name: 'code', type: 'string'}
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
            create: 'main/country/add_edit.php',
            read: 'main/country/countries.json.php',
            update: 'main/country/add_edit.php',
            destroy: 'main/country/delete.php'
        }
    }
});
