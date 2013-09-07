Ext.require([
    'Ext.ux.IFrame'
]);

Ext.define('Aenis.view.workflow.file.ViewDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.workflowFileViewDlg',

    modal: true,
    width: 800,
    height: 600,

    resizeable: true,
    maximizable: true,

    closeAction: 'destroy',

    layout: {
        type: 'border'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.file.ViewDlg',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        Ext.apply(this, {
            title: this.T('file'),
            xtype: 'container',

            layout: {
                type: 'fit'
            },

            items: [
                {
                    xtype: "uxiframe",
                    ref: 'contentIFrame',
                    border: false,
                    flex: 1
                }
            ],

            buttons: [
                {
                    text: this.T('download'),
                    action: 'download',
                    iconCls: 'icon-download'
                },
                {
                    text: this.T('close'),
                    action: 'cancel',
                    iconCls: 'icon-cancel'
                }
            ]
        });
        this.callParent(arguments);
    }
});

