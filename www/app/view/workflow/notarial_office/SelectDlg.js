Ext.require([
    'Aenis.view.workflow.notarial_office.components.Grid'
]);

Ext.define('Aenis.view.workflow.notarial_office.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.workflowNotarial_officeSelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: {
        type: 'fit'
    },
    minButtonWidth: 30,
    width: 600,
    height: 400,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.notarial_office.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'workflowNotarialOfficesGrid',
                    ref: 'itemsGrid',
                    header: false,
                    border: false,
                    tools: []
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
