Ext.require([
    'BestSoft.grid.Panel',
    'Ext.layout.container.Border',
    'Ext.ux.grid.FiltersFeature',
    'Ext.grid.column.Date',
    'Aenis.view.main.user.components.Grid',
    'Aenis.view.main.staff.components.Tree'
]);

Ext.define('Aenis.view.main.user.staff.Manage', {
    extend: 'Ext.container.Container',
    alias: 'widget.mainUserStaffManage',

    layout: {
        type: 'border'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.user.Manage',
        'Locale.hy_AM.main.staff.Manage',
        'Locale.hy_AM.main.user.staff.Manage',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        var emptyStore = Ext.create('Ext.data.ArrayStore', {fields:[],data:[]}),
            gridColumnRenderer = function(value, metaData, record, rowIndex, colIndex, store, view) {
                if(!record.get('is_active'))
                    metaData.style = 'opacity:0.3';
                var oColumn = view.headerCt.getGridColumns()[colIndex];
                if(Ext.typeOf(value) == 'date')
                {
                    return Ext.util.Format.dateRenderer(oColumn.format)(value, metaData, record, rowIndex, colIndex, store, view);
                }
                return value;
            };
        Ext.apply(this, {
            tabConfig: {
                title: this.T("tabTitle")
            },
            items: [
                {
                    region: 'west',
                    collapsible: true,
                    split: true,
                    xtype: 'main.user.Grid',
                    ref: 'usersGrid',
                    autoLoadStore: true,
                    width: '25%'
                },
                {
                    region: 'center',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'bsgrid',
                            ref: 'userStaffsGrid',
                            messages: {
                                createSuccess: this.T("assign_to_staff_success"),
                                updateSuccess: this.T("remove_from_staff_success")
                            },
                            flex: 1,
                            title: this.T('userStaffs'),
                            store: emptyStore,
                            initialStore: emptyStore,
                            features: [
                                {
                                    ftype: 'filters',
                                    encode: false,
                                    local: true
                                }
                            ],
                            columns: [
                                {
                                    text: this.T('user_id'),
                                    tooltip: this.T('user_id'),
                                    dataIndex: 'user_id',
                                    filterable: true,
                                    width: 70,
                                    renderer: gridColumnRenderer,
                                    hidden: true
                                },
                                {
                                    text: this.T('staff_id'),
                                    tooltip: this.T('staff_id'),
                                    dataIndex: 'staff_id',
                                    filterable: true,
                                    width: 70,
                                    renderer: gridColumnRenderer,
                                    hidden: true
                                },
                                {
                                    text: this.T('staff_title'),
                                    dataIndex: 'staff_title',
                                    flex: 2,
                                    renderer: gridColumnRenderer,
                                    hideable: false,
                                    filterable: true
                                },
                                {
                                    text: this.T('dep_title'),
                                    dataIndex: 'dep_title',
                                    flex: 3,
                                    renderer: gridColumnRenderer,
                                    filterable: true
                                },
                                {
                                    xtype: 'datecolumn',
                                    text: this.T('hire_date'),
                                    dataIndex: 'hire_date',
                                    format: 'd/m/Y H:i',
                                    width: 105,
                                    renderer: gridColumnRenderer,
                                    filterable: true
                                },
                                {
                                    xtype: 'datecolumn',
                                    text: this.T('leaving_date'),
                                    dataIndex: 'leaving_date',
                                    format: 'd/m/Y H:i',
                                    width: 105,
                                    renderer: gridColumnRenderer,
                                    filterable: true
                                }
                            ]
                        },
                        {
                            xtype: 'bsgrid',
                            ref: 'staffUsersGrid',
                            margin: '1 0',
                            flex: 1,
                            title: this.T('staffUsers'),
                            store: emptyStore,
                            initialStore: emptyStore,
                            features: [
                                {
                                    ftype: 'filters',
                                    encode: false,
                                    local: true
                                }
                            ],
                            columns: [
                                {
                                    text: this.T('user_id'),
                                    tooltip: this.T('user_id'),
                                    dataIndex: 'user_id',
                                    filterable: true,
                                    width: 70,
                                    renderer: gridColumnRenderer,
                                    hidden: true
                                },
                                {
                                    text: this.T('staff_id'),
                                    tooltip: this.T('staff_id'),
                                    dataIndex: 'staff_id',
                                    filterable: true,
                                    width: 70,
                                    renderer: gridColumnRenderer,
                                    hidden: true
                                },
                                {
                                    text: this.T('user_full_name'),
                                    dataIndex: 'user_full_name',
                                    flex: 1,
                                    hideable: false,
                                    renderer: gridColumnRenderer,
                                    filterable: true
                                },
                                {
                                    xtype: 'datecolumn',
                                    text: this.T('hire_date'),
                                    dataIndex: 'hire_date',
                                    format: 'd/m/Y H:i',
                                    width: 105,
                                    renderer: gridColumnRenderer,
                                    filterable: true
                                },
                                {
                                    xtype: 'datecolumn',
                                    text: this.T('leaving_date'),
                                    dataIndex: 'leaving_date',
                                    format: 'd/m/Y H:i',
                                    width: 105,
                                    renderer: gridColumnRenderer,
                                    filterable: true
                                }
                            ]
                        }
                    ],
                    bbar: [
                        '->',
                        {
                            xtype: 'bsbtnAdd',
                            ref: 'assignToStaffAction',
                            text: this.T('assign_to_staff'),
                            disabled: true
                        },
                        ' ',
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'removeFromStaffAction',
                            text: this.T('remove_from_staff'),
                            disabled: true
                        },
                        '->'
                    ]
                },
                {
                    region: 'east',
                    collapsible: true,
                    split: true,
                    xtype: 'main.staff.Tree',
                    header: true,
                    title: this.T('staffs'),
                    ref: 'staffsTree',
                    autoLoadStore: false,
                    rootVisible: false,
                    animate: false,
                    store: Ext.create('Aenis.store.main.Staffs'),
                    width: '25%'
                }
            ]
        });

        this.callParent(arguments);
    }
});
