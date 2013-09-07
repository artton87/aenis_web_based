Ext.require([
    'BestSoft.grid.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.grid.feature.Grouping',
    'Ext.ux.CheckColumn',
    'Aenis.store.workflow.notarial_office.Grid'
]);

/**
 * A grid, which displays notarial offices list in a default
 * language and features filters by various fields.
 */
Ext.define('Aenis.view.workflow.notarial_office.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowNotarialOfficesGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.notarial_office.components.Grid',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.applyIf(this, {
            title: this.T('offices'),
            minWidth: 380,
            store: Ext.create('Aenis.store.workflow.notarial_office.Grid'),
            features: [
                {
                    ftype: 'filters',
                    encode: false,
                    local: true
                },
                {
                    ftype:'grouping'
                }
            ],
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'id',
                    width: 70,
                    filterable: true,
                    hidden: true
                },
                {
                    text: this.T('region'),
                    dataIndex: 'region_title',
                    width: 100,
                    hideable: false,
                    filterable: true
                },
                {
                    text: this.T('community'),
                    dataIndex: 'community_title',
                    width: 120,
                    hideable: false,
                    filterable: true
                },
                {
                    text: this.T('address'),
                    dataIndex: 'address',
                    flex: 1,
                    hideable: false,
                    groupable: false,
                    filterable: true
                },
                {
                    text: this.T('postal_index'),
                    dataIndex: 'postal_index',
                    width: 120,
                    filterable: true
                }
            ]
        });
        this.callParent(arguments);
    }
});
