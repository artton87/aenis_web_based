Ext.define('Aenis.model.main.Staff', {
    extend: 'Ext.data.Model',

	requires:[
        'Aenis.model.main.staff.RoleSelection'
    ],
    
    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'dep_id', type: 'int'},
        {name: 'dep_title', type: 'string', persist: false},
        {name: 'parent_id', type: 'int'},
        {name: 'parent_title', type: 'string', persist: false},
        {name: 'title', type: 'string'},        
        {name: 'staff_order', type: 'int'},
        {name: 'roles', type: 'auto'}
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
            create: 'main/staff/add_edit.php',
            read: 'main/staff/staffs.json.php',
            update: 'main/staff/add_edit.php',
            destroy: 'main/staff/delete.php'
        }
    },
    
    hasMany:[
        {
            foreignKey: 'staff_id',
            associationKey: 'roles',
            name: 'roles',
            model: 'Aenis.model.main.staff.RoleSelection'
        }
    ]
});
