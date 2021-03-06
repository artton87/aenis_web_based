Ext.define('Aenis.model.main.user.Content', {
    extend: 'Ext.data.Model',

    /**
     * Let lang_id act as primary key in JS, because it is unique for each NotarialOffice.
     * This will significantly speed up searching by lang_id.
     */
    idProperty: 'lang_id',

    fields: [
        {name: 'user_id', type: 'int'},
        {name: 'lang_id', type: 'int'},
        {name: 'first_name', type: 'string'},
        {name: 'last_name', type: 'string'},
        {name: 'second_name', type: 'string'}
    ]
});
