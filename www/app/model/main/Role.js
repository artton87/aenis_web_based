Ext.define('Aenis.model.main.Role', {
    extend: 'Ext.data.Model',

    requires:[
        'Aenis.model.main.role.Resource'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'title', type: 'string'},
        {name: 'permissions', type: 'array'}
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
            create: 'main/role/add_edit.php',
            read: 'main/role/roles.json.php',
            update: 'main/role/add_edit.php',
            destroy: 'main/role/delete.php'
        }
    },

    hasMany: [{
        foreignKey: 'role_id',
        associationKey: 'resources',
        model: 'Aenis.model.main.role.Resource',
        name: 'resources'
    }]
});
