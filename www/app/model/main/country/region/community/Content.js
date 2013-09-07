Ext.define('Aenis.model.main.country.region.community.Content', {
    extend: 'Ext.data.Model',

    /**
     * Let lang_id act as primary key in JS, because it is unique for each community.
     * This will significantly speed up searching by lang_id.
     */
    idProperty: 'lang_id',

    fields: [
        {name: 'community_id', type: 'int'},
        {name: 'lang_id', type: 'int'},
        {name: 'name', type: 'string'}
    ]
});
