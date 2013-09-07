Ext.require([
    'BestSoft.tree.Panel'
]);

/**
 * A tree for selecting communities
 */
Ext.define('Aenis.view.main.country.location.components.LocationsTree', {
    extend: 'BestSoft.tree.Panel',
    alias: 'widget.mainCountryLocationsTree',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        Ext.apply(this, {
            header: false,
            hideHeaders: true,
            border: false,
            stateId: this.alias,
            collapsible: false,
            rootVisible: false,
            useArrows: true,
            animate: false,
            columns: [
                {
                    xtype: 'treecolumn',
                    flex: 1,
                    dataIndex: 'name'
                }
            ]
        });
        this.callParent(arguments);
    }
});
