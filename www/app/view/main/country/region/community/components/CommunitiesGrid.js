Ext.require([
    'Ext.ux.grid.FiltersFeature',
    'BestSoft.grid.Panel'
]);

/**
 * A grid for selecting countries
 */
Ext.define('Aenis.view.main.country.region.community.components.CommunitiesGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.mainCountryRegionCommunitiesGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.country.region.community.components.CommunitiesGrid',
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
                    xtype: 'booleancolumn',
                    text: this.T('is_urban'),
                    width: 90,
                    dataIndex: 'is_urban',
                    filterable: true
                }
            ]
        });
        this.callParent(arguments);
    }
});
