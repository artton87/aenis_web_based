Ext.require([
    'Aenis.view.main.contact.components.Juridical'
]);

Ext.define('Aenis.view.main.contact.juridical.SelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainContactJuridicalSelectDlg',

    modal: true,
    maximizable:true,
    closeAction: 'destroy',

    layout:{
        type:'fit'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.juridical.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        Ext.apply(this, {
            title: this.T("windowTitle"),
            items: [
                {
                    xtype:'main.contact.Juridical'
                }
            ],
            buttons: [
                {
                    xtype: 'bsbtnEdit',
                    ref: 'editAction',
                    disabled:true
                },
                {
                    xtype: 'bsbtnAdd',
                    ref: 'addAction',
                    disabled:true
                },
                {
                    text: this.T('select'),
                    ref: 'acceptAction',
                    iconCls: 'icon-ok',
                    disabled: true
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

