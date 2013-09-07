Ext.define('Aenis.model.main.country.Region', {
    extend: 'Ext.data.Model',

    requires:[
        'Aenis.model.main.country.region.Content'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'country_id', type: 'int'},
        {name: 'code', type: 'string'},
        {name: 'contentData', type: 'auto'}
    ],

    /**
     * Returns region name in a first language
     * @return {String}
     */
    getTitle: function() {
        return this.content().first().get('name');
    },

    hasMany:[
        {
            foreignKey: 'region_id',
            associationKey: 'content',
            name: 'content',
            model: 'Aenis.model.main.country.region.Content'
        },
        {
            foreignKey: 'region_id',
            associationKey: 'communities',
            name: 'communities',
            model: 'Aenis.model.main.country.region.Community'
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
            create: 'main/country/region/add_edit.php',
            read: 'main/country/region/regions.json.php',
            update: 'main/country/region/add_edit.php',
            destroy: 'main/country/region/delete.php'
        }
    }
});
