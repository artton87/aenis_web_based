Ext.define('Aenis.model.main.Language', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'code', type: 'string'},
        {name: 'title', type: 'string'},
        {name: 'is_default', type: 'boolean'}
    ],

    proxy: {
        type: 'ajax',

        reader: {
            type: 'json',
            root: 'data'
        },

        api: {
            read: 'main/language/languages.json.php'
        }
    }
});
