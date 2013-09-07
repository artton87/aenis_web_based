Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label'
]);

Ext.define('Aenis.view.main.contact.natural.ViewDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainContactNaturalViewDlg',

    modal: true,
    width:400,
    height:400,

    closeAction: 'destroy',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.natural.ViewDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        Ext.apply(this, {
            title: this.T('data'),
            xtype:'container',
            ref:'dataView',
            autoScroll:true,

            items: [
                {
                    xtype:'form',
                    ref:'dataContent',
                    defaultType: 'displayfield',

                    items:[
                        {
                            fieldLabel:this.T("first_name"),
                            name:'first_name'
                        },
                        {
                            fieldLabel:this.T("last_name"),
                            name:'last_name'
                        },
                        {
                            fieldLabel:this.T("second_name"),
                            name:'second_name'
                        },
                        {
                            fieldLabel:this.T("date_of_birth"),
                            name:'date_of_birth'
                        },
                        {
                            fieldLabel:this.T("social_card_number"),
                            name:'social_card_number'
                        },
                        {
                            fieldLabel:this.T("passport_number"),
                            name:'passport_number'
                        },
                        {
                            fieldLabel:this.T("given_date"),
                            name:'given_date'
                        },
                        {
                            fieldLabel:this.T("fax"),
                            name:'fax'
                        },
                        {
                            fieldLabel:this.T("phone_home"),
                            name:'phone_home'
                        },
                        {
                            fieldLabel:this.T("phone_office"),
                            name:'phone_office'
                        },
                        {
                            fieldLabel:this.T("zip"),
                            name:'zip'
                        },
                        {
                            fieldLabel:this.T("email"),
                            name:'email'
                        },
                        {
                            fieldLabel:this.T("organization_name"),
                            name:'organization_name'
                        },
                        {
                            fieldLabel:this.T("staff_name"),
                            name:'staff_name'
                        },
                        {
                            fieldLabel:this.T("address"),
                            name:'address'
                        },
                        {
                            fieldLabel:this.T("country_label"),
                            name:'country_label'
                        },
                        {
                            fieldLabel:this.T("authority"),
                            name:'authority'
                        }

                        ]
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

