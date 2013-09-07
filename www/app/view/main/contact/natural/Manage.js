Ext.require([
    'Aenis.view.main.contact.components.Natural'
]);


Ext.define('Aenis.view.main.contact.natural.Manage', {
    extend: 'Ext.container.Container',

    alias: 'widget.mainContactNaturalManage',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.natural.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        this.tabConfig = {
            title: this.T("natural_contact_classifier")
        };
        this.items = {
            border:false,
            items: [
                {
                    xtype:'main.contact.Natural'
                },
                {
                    xtype:'form',
                    ref: 'viewForm',
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

                                    name: 'first_name',
                                    flex:1,
                                    fieldLabel:this.T('first_name')
                                },
                                {
                                    name: 'last_name',
                                    flex:1,
                                    fieldLabel:this.T('last_name')

                                },
                                {
                                    name: 'second_name',
                                    flex:1,
                                    fieldLabel:this.T('second_name')
                                },
                                {
                                    name: 'email',
                                    flex:1,
                                    fieldLabel:this.T('email')
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'fax',
                                    flex:1,
                                    fieldLabel:this.T('fax')
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
                                    xtype: 'textfield',
                                    name: 'phone_home',
                                    flex:1,
                                    fieldLabel:this.T('home_telephone')
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'phone_office',
                                    flex:1,
                                    fieldLabel:this.T('work_telephone')
                                },
                                {
                                    name: 'phone_mobile',
                                    flex:1,
                                    fieldLabel:this.T('mobile_telephone'),
                                    border:false

                                },
                                {
                                    name: 'organization_name',
                                    flex:1,
                                    fieldLabel:this.T('company')
                                },
                                {
                                    name: 'staff_name',
                                    flex:1,
                                    fieldLabel:this.T('staff')
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
                                    name: 'social_card_number',
                                    flex:1,
                                    fieldLabel:this.T('social_card_number')
                                },
                                {
                                    flex:1,
                                    fieldLabel:this.T("country"),
                                    name:'country_label'
                                },
                                {
                                    name:'passport_number',
                                    fieldLabel:this.T("passport_number"),
                                    flex:1

                                },
                                {
                                    name:'date_of_birth',
                                    fieldLabel:this.T("date_of_birth"),
                                    flex:1,
                                    renderer: Ext.util.Format.dateRenderer('d/m/Y')
                                },
                                {
                                    xtype:'textarea',
                                    name:'address',
                                    flex:2,
                                    fieldLabel:this.T("address")

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
                                },
                                {

                                    text: this.T('select'),
                                    action: 'accept',
                                    iconCls: 'icon-ok',
                                    disabled: true,
                                    hidden:true
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

