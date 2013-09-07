Ext.require([
    'Ext.ux.IFrame'
]);

Ext.define('Aenis.view.workflow.object.ViewDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.workflowObjectViewDlg',

    modal: true,
    width: 400,
    height: 300,

    resizeable: true,
    maximizable: true,

    closeAction: 'destroy',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.object.ViewDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        Ext.apply(this, {
            title: this.T('documents'),
            xtype:'container',
            ref:'dataView',


            items: [
                {
                    xtype: "uxiframe",
                    ref: 'contentIFrame',
                    border: false
                }
            ],

            buttons: [
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

