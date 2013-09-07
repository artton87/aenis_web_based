Ext.define('Aenis.model.main.user.Resource', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'user_id', type: 'int'},
        {name: 'resource_id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'allowed', type: 'bool'},
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
            read: 'main/user/resource/resources.json.php',
            create: 'main/user/resource/update.php',
            update: 'main/user/resource/update.php',
            destroy: 'main/user/resource/reset.php'
        }
    }
});
