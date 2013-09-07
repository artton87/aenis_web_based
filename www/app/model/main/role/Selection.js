Ext.define('Aenis.model.main.role.Selection', {
    extend: 'Ext.data.Model',

    idProperty: 'role_id',

    fields: [
        {type: 'int', name: 'role_id'},
        {type: 'string', name: 'title'}
    ],

    proxy: {
        type: 'memory'
    }
});
