Ext.define('Aenis.model.main.User', {
	extend: 'Ext.data.Model',
	
	requires:[
        'Aenis.model.main.user.Content'
    ],
    
	idProperty: 'id',
	fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'username', type: 'string'},
        {name: 'password', type: 'string'},
        {name: 'passport', type: 'string'},
        {name: 'ssn', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'fax_number', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'phone_mobile', type: 'string'},
        {name: 'notary_code', type: 'string'},
        {name: 'is_ws_consumer', type: 'boolean'},
        {name: 'is_notary', type: 'boolean'},
        {name: 'contentData', type: 'auto'}
    ],
    
    hasMany:[
        {
            foreignKey: 'user_id',
            associationKey: 'content',
            name: 'content',
            model: 'Aenis.model.main.user.Content'
        }
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
            create: 'main/user/add_edit.php',
            read: 'main/user/users.json.php',
            update: 'main/user/add_edit.php',
            destroy: 'main/user/delete.php'
        }
    }
});
