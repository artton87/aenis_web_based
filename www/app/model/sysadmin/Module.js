Ext.define('Aenis.model.sysadmin.Module', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'description', type: 'description'},
        {name: 'module', type: 'string'},
        {name: 'is_enabled', type: 'boolean'},
        {name: 'app_order', type: 'int'},
        {name: 'resource_id', type: 'int'},
        {name: 'resource_id', type: 'int'},
        {name: 'auto_sync_with_resource', type: 'boolean'}
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
            create: 'sysadmin/module/add_edit.php',
            read: 'sysadmin/module/modules.json.php',
            update: 'sysadmin/module/add_edit.php',
            destroy: 'sysadmin/module/delete.php'
        }
    }
});
