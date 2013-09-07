Ext.define('Aenis.model.main.Department', {
    extend: 'Ext.data.Model',
        
    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'parent_id', type: 'int'},
        {name: 'parent_title', type: 'string', persist: false},
        {name: 'num', type: 'int'},
        {name: 'code', type: 'int'},
        {name: 'fax', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'type_id', type: 'int'},
        {name: 'notarial_office_id', type: 'int'},
        {name: 'notarial_office_title', type: 'string', persist: false}
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
            create: 'main/department/add_edit.php',
            read: 'main/department/departments.json.php',
            update: 'main/department/add_edit.php',
            destroy: 'main/department/delete.php'
        }
    }
});
