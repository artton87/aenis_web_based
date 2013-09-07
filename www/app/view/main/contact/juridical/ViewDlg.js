Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label'
]);

Ext.define('Aenis.view.main.contact.juridical.ViewDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainContactJuridicalViewDlg',

    modal: true,
    width:300,
    height:200,

    closeAction: 'destroy',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.juridical.ViewDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        Ext.apply(this, {
            title: 'subject',
            xtype:'container',
            ref:'dataView',

            items: [
                {
                    xtype:'container',
                    ref:'dataContent',
                    defaultType: 'label',
                    items:[]
                }
            ],
            dataConfig:{
                xtype:'fieldcontainer',
                layout:{
                    type:'hbox'
                },
                defaultType: 'label',
                items:[
                    {
                        text:''
                    }
                    ]
            },
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

