Ext.require([
    'BestSoft.grid.Panel',
    'Ext.grid.column.Boolean',
    'Ext.grid.feature.Grouping',
    'Ext.ux.grid.FiltersFeature',
    'Aenis.store.main.user.Grid'
]);

/**
 * A grid, which displays users list in a default
 * language and features filters by various fields.
 */
Ext.define('Aenis.view.main.user.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.main.user.Grid',

    styleSheets: [
        'main/user/components/Grid.css'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.user.components.Grid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader',
        'BestSoft.mixin.ShowConditionalElements'
    ],

    initComponent: function() {
        this.loadStyleSheets();
        Ext.applyIf(this, {
            title: this.T('users'),
            minWidth: 380,
            store: Ext.create('Aenis.store.main.user.Grid'),
            tbar: {
                resourceRequiredToShow: {
                    toBeRoot: true
                },
                items: [
                    '->',
                    {
                        xtype: 'button',
                        text: this.T("show_users"),
                        iconCls: 'grid-is_ws_consumer_0',
                        pressed: true,
                        toggleGroup: 'user_type',
                        listeners: {
                            toggle: function(btn, pressed) {
                                if(pressed)
                                    btn.up('bsgrid').loadStore({params:{is_ws_consumer:0}})
                            }
                        }
                    },
                    ' ',
                    {
                        xtype: 'button',
                        text: this.T("show_ws_consumers"),
                        iconCls: 'grid-is_ws_consumer_1',
                        toggleGroup: 'user_type',
                        listeners: {
                            toggle: function(btn, pressed) {
                                if(pressed)
                                    btn.up('bsgrid').loadStore({params:{is_ws_consumer:1}})
                            }
                        }
                    },
                    '->'
                ]
            },
            features: [
                {
                    ftype: 'filters',
                    encode: false,
                    local: true
                },
                {
                    ftype: 'grouping',
                    enableGroupingMenu: false,
                    groupHeaderTpl: Ext.create('Ext.XTemplate', [
                        "<tpl if='groupValue'>"+this.T("has_position")+"</tpl>",
                        "<tpl if='!groupValue'>"+this.T("does_not_have_position")+"</tpl>"
                    ])
                }
            ],
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'id',
                    width: 70,
                    filterable: true,
                    groupable: false,
                    hidden: true
                },
                {
                    text: this.T('first_name'),
                    dataIndex: 'first_name',
                    flex: 1,
                    hideable: false,
                    groupable: false,
                    filterable: true
                },
                {
                    text: this.T('last_name'),
                    dataIndex: 'last_name',
                    flex: 1,
                    hideable: false,
                    groupable: false,
                    filterable: true
                },
                {
                    text: this.T('second_name'),
                    dataIndex: 'second_name',
                    flex: 1,
                    groupable: false,
                    filterable: true
                },
                {
                    xtype: 'booleancolumn',
                    text: this.T('has_position'),
                    dataIndex: 'has_position',
                    width: 120,
                    hidden: true,
                    hideable:false
                }
            ]
        });
        this.callParent(arguments);
    }
});
