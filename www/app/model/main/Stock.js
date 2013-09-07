Ext.define('Aenis.model.main.Stock', {
    extend: 'Ext.data.Model',

    idProperty: "id",

    fields: [
        {type: 'string', name: 'name'},
        {type: 'string', name: 'surname'},
        {type: 'string', name: 'organization_name'}
    ],

    /**
     * Returns human-readable name of stock
     * @return {String}
     */
    getName: function() {
        //@TODO implement Aenis.model.main.Stock::getName() method
        return 'TODO';
    }
});
