Ext.require([
    'BestSoft.grid.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.ux.CheckColumn'
]);

/**
 * A grid for selecting multiple resources, which features
 * local filtering of resources list by each grid column.
 */
Ext.define('Aenis.view.sysadmin.resource.components.SelectorGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.sysadmin.resource.SelectorGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.sysadmin.resource.components.SelectorGrid',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        Ext.applyIf(this, {
            title: this.T('resources'),
            flex: 1,
            features: [
                {
                    ftype: 'filters',
                    encode: false,
                    local: true
                },
                {
                    ftype:'grouping',
                    enableGroupingMenu: false
                }
            ],
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'resource_id',
                    filterable: true,
                    hidden: true
                },
                {
                    text: this.T('title'),
                    flex: 1,
                    dataIndex: 'title',
                    hideable: false,
                    filterable: true
                },
                {
                    text: this.T('code'),
                    flex: 1,
                    dataIndex: 'code',
                    hideable: false,
                    filterable: true,
                    resourceRequiredToShow: {
                        toBeRoot: true
                    }
                },
                {
                    xtype: 'checkcolumn',
                    text: this.T('allowed'),
                    dataIndex: 'allowed',
                    hideable: false,
                    filterable: true
                },
                {
                    text: this.T('type'),
                    dataIndex: 'type_label',
                    hideable: false,
                    hidden: true
                }
            ]
        });
        this.callParent(arguments);
    },


    /**
     * Returns array of resources, which have been checked or unchecked.
     * Each element of array is an object with 'resource_id', 'allowed' keys, where
     * 'allowed' is true, when resource was checked and is 'false' otherwise.
     * @return {Array}
     */
    getModifiedItemsInfo: function() {
        var permissions = [];
        Ext.Array.each(this.getStore().getModifiedRecords(), function(model) {
            permissions.push({
                resource_id: model.get('resource_id'),
                allowed: model.get('allowed')
            });
        });
        return permissions;
    },


    /**
     * Returns array of resources, which are checked.
     * Each element of array is an object with 'resource_id', 'allowed' keys, where 'allowed' is true
     * @return {Array}
     */
    getAllAllowedItemsInfo: function() {
        var permissions = [];
        this.getStore().each(function(model) {
            if(model.data.allowed)
                permissions.push({
                    resource_id: model.get('resource_id'),
                    allowed: model.get('allowed')
                });
        });
        return permissions;
    }
});
