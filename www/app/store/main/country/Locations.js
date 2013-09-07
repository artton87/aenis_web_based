Ext.define('Aenis.store.main.country.Locations', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true,
        loaded: true
    },

    autoLoad: false,

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'region_id', type: 'int'},
        {name: 'community_id', type: 'int'},
        {name: 'type', type: 'string'},
        {name: 'name', type: 'string'}
    ],

    proxy: {
        type: 'ajax',

        reader: {
            type: 'json',
            root: 'data'
        },

        api: {
            read: 'main/country/location/locations.json.php'
        }
    }
});
