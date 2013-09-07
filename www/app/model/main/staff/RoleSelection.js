Ext.define('Aenis.model.main.staff.RoleSelection', {
    extend: 'Ext.data.Model',

    idProperty: "role_id",

    fields: [
    	{name: 'role_id', type: 'int'},
    	{name: 'title', type: 'string'}
    ],

    proxy: {
        type: 'memory'
    }
});
