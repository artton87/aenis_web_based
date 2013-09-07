Ext.require([
    'Ext.tab.Panel',
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label'
]);

Ext.define('Aenis.view.main.other.SelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainOtherSelectDlg',

    modal: true,
    closeAction: 'destroy',

    layout:{
        type: 'fit'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.other.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            title: this.T("others"),
            minWidth: 400,
            minHeight: 150,
            items: [
                {
                    xtype: 'form',
                    ref: 'otherForm',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        margin: '5px'
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            name: 'name',
                            flex: 1,
                            emptyText: this.T("subject_text")
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: this.T('select'),
                    ref: 'acceptAction',
                    iconCls: 'icon-ok'
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

