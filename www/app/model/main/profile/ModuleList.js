Ext.define('Aenis.model.main.profile.ModuleList', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title', 'description', 'module'],
    validations: [
    	{type: 'presence', field: 'id'},
    	{type: 'presence', field: 'title'},
    	{type: 'presence', field: 'description'},
    	{type: 'presence', field: 'module'}
    ]
});