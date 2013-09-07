Ext.define('Aenis.model.main.staff.User', {
	extend: 'Ext.data.Model',

	idProperty: 'id',
	fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'staff_id', type: 'int'},
        {name: 'user_id', type: 'int'},
        {name: 'user_full_name', type: 'string', persist: false},
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

        api: {
            read: 'main/staff/users.json.php'
        }
    }
});
