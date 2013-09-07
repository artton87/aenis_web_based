Ext.require([
    'BestSoft.grid.Panel',
    'Aenis.store.workflow.Templates',
    'Ext.grid.column.Boolean',
    'Ext.ux.grid.FiltersFeature',
    'Ext.grid.feature.Grouping'
]);

/**
 * A grid for selecting templates
 */
Ext.define('Aenis.view.workflow.template.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowTemplatesGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.template.components.Grid',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        Ext.apply(this, {
            title: this.T('templates'),
            features: [
                {
                    ftype: 'filters',
                    encode: false,
                    local: true
                },
                {
                    ftype: 'grouping',
                    groupHeaderTpl: Ext.create('Ext.XTemplate', [
                        "<tpl if='groupValue'>{columnName}: {name}</tpl>",
                        "<tpl if='!groupValue'>"+this.T("is_common_template")+"</tpl>"
                    ])
                }
            ],
            autoLoadStore: false,
            store: Ext.create('Aenis.store.workflow.Templates'),
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'id',
                    width: 70,
                    hidden: true,
                    groupable: false,
                    filterable: true
                },
                {
                    text: this.T('title'),
                    flex: 1,
                    dataIndex: 'title',
                    hideable: false,
                    groupable: false,
                    filterable: true
                },
                {
                    text: this.T('definer'),
                    width: 220,
                    dataIndex: 'definer_user_full_name',
                    hidden: true,
                    groupable: true,
                    filterable: true
                }
            ]
        });
        this.callParent(arguments);
    }
});
