Ext.require([
    'Ext.ux.IFrame'
]);

Ext.define('Aenis.view.workflow.template.PreviewDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.workflowTemplatePreviewDlg',

    closeAction: 'destroy',
    modal: true,
    layout: {
        type: 'fit'
    },
    minButtonWidth: 30,
    width: 800,
    height: 500,
    resizeable: true,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.template.PreviewDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: "uxiframe",
                    ref: 'iFrame',
                    border: false
                }
            ],
            buttons: [
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
