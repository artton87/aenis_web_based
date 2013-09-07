Ext.define('Aenis.model.sysadmin.menu.Item', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'app_id', type: 'int'},
        {name: 'resource_id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'parent_id', type: 'int'},
        {name: 'parent_title', type: 'string', persist: false},
        {name: 'has_menu_sep', type: 'boolean'},
        {name: 'menu_order', type: 'int'},
        {name: 'is_enabled', type: 'boolean'},
        {name: 'command', type: 'string'},
        {name: 'has_toolbar_button', type: 'boolean'},
        {name: 'has_toolbar_sep', type: 'boolean'},
        {name: 'toolbar_order', type: 'int'},
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
            create: 'sysadmin/menu/add_edit.php',
            read: 'sysadmin/module/menu/menuItems.json.php',
            update: 'sysadmin/menu/add_edit.php',
            destroy: 'sysadmin/menu/delete.php'
        }
    }
});
