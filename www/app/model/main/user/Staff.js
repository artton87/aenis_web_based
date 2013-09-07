Ext.define('Aenis.model.main.user.Staff', {
	extend: 'Ext.data.Model',

	idProperty: 'id',
	fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'staff_id', type: 'int'},
        {name: 'user_id', type: 'int'},
        {name: 'staff_title', type: 'string'},
        {name: 'dep_title', type: 'string'},
        {name: 'is_active', type: 'boolean'},
        {name: 'hire_date', type: 'date', useNull: true},
        {name: 'leaving_date', type: 'date', useNull: true}
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
            read: 'main/user/position/staffs.json.php',
            create: 'main/user/position/assign.php',
            update: 'main/user/position/remove.php'
        }
    }
});
