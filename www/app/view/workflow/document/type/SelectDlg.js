Ext.require([
    'BestSoft.tree.Panel',
    'Aenis.view.workflow.document.type.components.Tree'
]);

Ext.define('Aenis.view.workflow.document.type.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.workflowDocumentTypeSelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: 'fit',
    minButtonWidth: 30,
    width: 580,
    height: 450,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.document.type.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'workflow.document.type.Tree',
                    ref: 'itemsTree',
                    autoLoadStore: false,
                    animate: false,
                    store: Ext.create('Aenis.store.workflow.document.Types')
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
