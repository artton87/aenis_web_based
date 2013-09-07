Ext.define('Aenis.model.sysadmin.menu.Module', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'description', type: 'description'},
        {name: 'module', type: 'string'},
        {name: 'is_enabled', type: 'boolean'},
        {name: 'app_order', type: 'int'}
    ]
});
