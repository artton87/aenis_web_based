Ext.define('Aenis.model.main.staff.TreeItem', {
    extend: 'Aenis.model.main.Staff',
    requires: [
        'Aenis.model.main.Staff',
        'Aenis.model.main.staff.User'
    ],

    hasMany:[
        {
            foreignKey: 'staff_id',
            associationKey: 'users',
            model: 'Aenis.model.main.staff.User',
            name: 'users'
        }
    ]
});
