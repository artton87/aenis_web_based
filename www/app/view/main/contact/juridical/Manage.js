Ext.require([
    'Aenis.view.main.contact.components.Juridical'
]);


Ext.define('Aenis.view.main.contact.juridical.Manage', {
    extend: 'Ext.container.Container',

    alias: 'widget.mainContactJuridicalManage',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.juridical.Manage',
        'BestSoft.mixin.Localized'
    ],
    initComponent: function(){
        this.tabConfig = {
            title: this.T("juridical_contact_classifier")
        };
        this.items = {
            border:false,
            items: [
                {
                    xtype:'main.contact.Juridical'
                },
                {
                    xtype:'form',
                    itemId:'viewForm',
                    layout:{
                        'type':'hbox',
                        'align':'stretch'
                    },
                    border:false,
                    items:[
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'vbox',
                                align:'stretch'
                            },
                            fieldDefaults:{
                                readOnly:true,
                                inputWidth:250
                            },
                            defaultType: 'textfield',
                            margin:20,
                            items: [
                                {
                                    name: 'organization_name',
                                    flex:1,
                                    fieldLabel:this.T('organization_name')
                                },
                                {
                                    name: 'registration_number',
                                    flex:1,
                                    fieldLabel:this.T('registration_number')

                                },
                                {
                                    name: 'foundation_date',
                                    flex:1,
                                    fieldLabel:this.T('foundation_date')
                                },
                                {
                                    name: 'phone',
                                    flex:1,
                                    fieldLabel:this.T('phone')
                                }
                            ]
                        },
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'vbox',
                                align:'stretch'
                            },
                            fieldDefaults:{
                                readOnly:true,
                                inputWidth:250
                            },
                            defaultType: 'textfield',
                            margin:20,
                            items:[
                                {
                                    name: 'website',
                                    flex:1,
                                    fieldLabel:this.T('website')
                                },
                                {
                                    name: 'organization_type',
                                    flex:1,
                                    fieldLabel:this.T('organization_type')
                                },
                                {
                                    name: 'tax_account',
                                    flex:1,
                                    fieldLabel:this.T('tax_account')
                                },
                                {
                                    name: 'certificate_number',
                                    flex:1,
                                    fieldLabel:this.T('certificate_number'),
                                    border:false
                                }
                            ]
                        },
                        {
                            xtype:'fieldcontainer',

                            layout:{
                                type:'vbox',
                                align:'stretch'
                            },
                            fieldDefaults:{
                                readOnly:true,
                                labelWidth:200,
                                inputWidth:250
                            },
                            margin:20,
                            defaultType: 'textfield',
                            items:[
                                {
                                    name: 'fax',
                                    flex:1,
                                    fieldLabel:this.T('fax')
                                },
                                {
                                    name: 'email',
                                    flex:1,
                                    fieldLabel:this.T('email')
                                },
                                {
                                    name: 'country_label',
                                    flex:1,
                                    fieldLabel:this.T('country')
                                },
                                {
                                    xtype:'textarea',
                                    name:'additional_information',
                                    fieldLabel:this.T("additional_information"),
                                    flex:1
                                }
                            ]
                        },
                        {
                            xtype:'container',
                            layout:{
                                type:'vbox',
                                align:'center',
                                pack:'center'
                            },
                            items:[
                                {
                                    xtype:'bsbtnEdit',
                                    ref: 'editAction',
                                    disabled:true,
                                    margin:'0 0 5 20'
                                },
                                {
                                    xtype:'bsbtnAdd',
                                    ref: 'addAction',
                                    disabled:true,
                                    margin:'5 0 0 20'
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        this.callParent(arguments);
    }
});

