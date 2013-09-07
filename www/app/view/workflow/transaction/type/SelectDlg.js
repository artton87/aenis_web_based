Ext.require([
    'BestSoft.tree.Panel',
    'BestSoft.tree.filter.Text',
    'Aenis.store.workflow.transaction.Types'
]);

Ext.define('Aenis.view.workflow.transaction.type.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.workflowTransactionTypeSelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: 'fit',
    minButtonWidth: 30,
    width: 480,
    height: 450,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.transaction.type.SelectDlg',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.MultiLanguageContentRenderer'
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
                    stateId: 'workflow.transaction.Types',
                    autoLoadStore: false,
                    store: Ext.create('Aenis.store.workflow.transaction.Types'),
                    collapsible: false,
                    rootVisible: false,
                    useArrows: true,
                    animate: false,
                    filterLeafsOnly: true,
                    tbar: [
                        {
                            xtype: 'bsTreeFilterText',
                            ref: 'itemsTreeFilterField',
                            emptyText: me.T('quick_search'),
                            width: 300,
                            filterFn: function(node) {
                                var val = this.getValue();
                                return (val == "") || (node.getTitle().indexOf(val)>=0);
                            }
                        },
                        '->'
                    ],
                    columns: [
                        {
                            xtype: 'treecolumn',
                            flex: 1,
                            dataIndex: 'label',
                            renderer: this.singleLanguageContentRenderer
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
