Ext.require([
    'Ext.tab.Panel',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Ext.form.field.File'
]);

Ext.define('Aenis.view.workflow.will.View', {
    extend:'Ext.window.Window',

    alias: 'widget.workflowWillView',

    modal: true,
    closeAction: 'destroy',

    layout:{
        type: 'vbox',
        align: 'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.will.View',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        Ext.apply(this, {
            title: this.T("inheritance_application_view"),
            width: 700,
            height: 600,
            items: [
                {
                    xtype:'container',
                    ref:'partiesPanel',
                    autoScroll: true,
                    layout:{
                        type:'hbox'
                    },
                    items:[]
                },
                {
                    xtype:'container',
                    ref:'objectsPanel',
                    layout:{
                        type:'hbox'
                    },
                    items:[]
                },
                {
                    xtype:'container',
                    ref:'documentsPanel',
                    layout:{
                        type:'hbox'
                    },
                    items:[]
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


