Ext.require([
    'BestSoft.tree.Panel',
    'BestSoft.tree.filter.Text',
    'Aenis.store.main.Departments'
]);

Ext.define('Aenis.view.main.department.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainDepartmentSelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: 'fit',
    resizeHandles: 'e w',
    minButtonWidth: 30,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.department.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'bstree',
                    header: false,
                    hideHeaders: true,
                    border: false,
                    ref: 'itemsTree',
                    stateId: 'main.department.Items',
                    store: Ext.create('Aenis.store.main.Departments'),
                    minWidth: 480,
                    minHeight: 450,
                    maxHeight: 450,
                    collapsible: false,
                    autoLoadStore: false,
                    rootVisible: false,
                    useArrows: true,
                    animate: false,
                    tbar: [
                        {
                            xtype: 'bsTreeFilterText',
                            ref: 'itemsTreeFilterField',
                            emptyText: me.T('quick_search'),
                            width: 300,
                            filterFn: function(node) {
                                var val = this.getValue();
                                return (val == "") || (node.get('title').indexOf(val)>=0);
                            }
                        },
                        '->'
                    ],
                    columns: [
                        {
                            xtype: 'treecolumn',
                            flex: 1,
                            dataIndex: 'title'
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: me.T('select'),
                    ref: 'acceptAction',
                    iconCls: 'icon-ok',
                    disabled: true
                },
                {
                    text: me.T('close'),
                    action: 'cancel',
                    iconCls: 'icon-cancel'
                }
            ]
        });
    	this.callParent(arguments);
    }
});
