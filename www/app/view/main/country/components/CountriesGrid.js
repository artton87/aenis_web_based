Ext.require([
    'BestSoft.grid.Panel',
    'Ext.ux.grid.FiltersFeature'
]);

/**
 * A grid for selecting countries
 */
Ext.define('Aenis.view.main.country.components.CountriesGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.mainCountriesGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.country.components.CountriesGrid',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        Ext.apply(this, {
            features: [
                {
                    ftype: 'filters',
                    encode: false,
                    local: true
                }
            ],
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'id',
                    hidden: true,
                    width: 70,
                    filterable: true
                },
                {
                    text: this.T('name'),
                    flex: 1,
                    dataIndex: 'name',
                    hideable: false,
                    filterable: true
                },
                {
                    text: this.T('code'),
                    width: 60,
                    dataIndex: 'code',
                    filterable: true
                }
            ]
        });
        this.callParent(arguments);
    }
});
