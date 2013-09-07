Ext.require([
    'Ext.ux.grid.FiltersFeature',
    'BestSoft.grid.Panel'
]);

/**
 * A grid for selecting countries
 */
Ext.define('Aenis.view.main.country.region.components.RegionsGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.mainCountryRegionsGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.country.region.components.RegionsGrid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.MultiLanguageContentRenderer'
    ],


    initComponent: function() {
        Ext.apply(this, {
            autoLoadStore: false,
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
                    filterable: true,
                    renderer: this.singleLanguageContentRenderer
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
