Ext.require([
    'BestSoft.grid.Panel',
    'Ext.ux.grid.FiltersFeature'
]);

/**
 * A grid for selecting roles
 */
Ext.define('Aenis.view.main.role.components.RolesGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.mainRolesGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.role.components.RolesGrid',
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
                    text: this.T('title'),
                    flex: 1,
                    dataIndex: 'title',
                    hideable: false,
                    filterable: true
                }
            ]
        });
        this.callParent(arguments);
    }
});
