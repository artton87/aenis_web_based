Ext.require([
    'BestSoft.grid.Panel',
    'Ext.toolbar.Paging',
    'Ext.form.Panel',
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.FieldContainer',
    'Ext.form.RadioGroup',
    'Aenis.store.main.contact.Natural'
]);

Ext.define('Aenis.view.main.contact.components.Natural', {
    extend:'Ext.panel.Panel',
    alias: 'widget.main.contact.Natural',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.components.Natural',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        var naturalContactsStore = Ext.create('Aenis.store.main.contact.Natural');
        Ext.apply(this, {
            items: [
                {
                    xtype:'form',
                    ref: 'naturalSearchForm',
                    layout:{
                        type: 'vbox',
                        align: 'center'
                    },
                    flex:1,
                    header: false,
                    defaults: {
                        margin: 5
                    },
                    messages: {
                        first_name_is_empty: this.T('first_name_is_empty'),
                        last_name_is_empty: this.T('last_name_is_empty'),
                        social_card_number_is_empty: this.T('social_card_number_is_empty'),
                        passport_number_is_empty: this.T('passport_number_is_empty'),
                        death_certificate_is_empty: this.T('death_certificate_is_empty'),
                        fallback: this.T('fallback_message')
                    },
                    items:[
                        {
                            xtype: 'container',
                            defaults: {
                                margin: 5
                            },
                            layout:{
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype:'fieldcontainer',
                                    layout:{
                                        type: 'hbox'
                                    },
                                    fieldDefaults: {
                                        labelAlign:'right',
                                        width: 260,
                                        labelWidth:130
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            name:'first_name',
                                            fieldLabel:this.T('first_name')
                                        },
                                        {
                                            xtype:'textfield',
                                            name:'last_name',
                                            fieldLabel:this.T("last_name")

                                        },
                                        {
                                            xtype:'textfield',
                                            name:'second_name',
                                            fieldLabel:this.T("second_name")
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldcontainer',
                                    layout:{
                                        type:'hbox'
                                    },
                                    fieldDefaults: {
                                        labelAlign:'right',
                                        width: 260,
                                        labelWidth:130
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            name : 'social_card_number',
                                            fieldLabel:this.T("social_card_number"),
                                            flex: 1,
                                            maxLength: 10,
                                            enforceMaxLength: true,
                                            vtype:'am_ssn'
                                        },
                                        {
                                            xtype:'textfield',
                                            name : 'passport_number',
                                            flex: 1,
                                            fieldLabel:this.T("passport_number"),
                                            maxLength: 9,
                                            enforceMaxLength: true,
                                            vtype:'am_passport'
                                        },
                                        {
                                            xtype:'datefield',
                                            name : 'date_of_birth',
                                            fieldLabel:this.T("date_of_birth"),
                                            maxLength: 10,
                                            enforceMaxLength: true,
                                            emptyText:this.T("dmy")
                                        }
                                    ]
                                },

                                {
                                    xtype:'fieldcontainer',
                                    ref: 'deathCertificate',
                                    hidden: true,
                                    layout:{
                                        type:'hbox',
                                        align: 'center',
                                        pack: 'center'
                                    },
                                    fieldDefaults: {
                                        labelAlign:'right',
                                        width: 260,
                                        labelWidth:130
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            name : 'death_certificate',
                                            afterLabelTextTpl: BestSoft.required,
                                            fieldLabel:this.T("death_certificate"),
                                            enforceMaxLength: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            ref: 'searchPlaces',
                            fieldLabel: this.T("search_place"),
                            labelWidth: 120,
                            labelAlign: 'right',
                            columns:3,
                            items:[
                                {
                                    name: 'storage',
                                    boxLabel: this.T("from_database"),
                                    inputValue: 'from_db',
                                    ref: 'storageFromDbRadio',
                                    width:100
                                },
                                {
                                    name:'storage',
                                    inputValue:'from_nork',
                                    boxLabel: this.T("from_Nork_Information_Center"),
                                    width:220
                                },
                                {
                                    name:'storage',
                                    inputValue:'from_mergelyan',
                                    boxLabel: this.T("from_Mergelyan_Information_Center"),
                                    checked:true,
                                    width:230
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            dock: 'bottom',
                            layout: {
                                type: 'hbox',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    formBind: true,
                                    text:this.T("search"),
                                    action:'searchContact',
                                    iconCls: 'icon-search'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'bsgrid',
                    autoLoadStore:false,
                    title:this.T('results'),
                    ref:'naturalContactsGrid',
                    height: 200,
                    flex:1,
                    store:naturalContactsStore,
                    columns: [
                        {
                            header: "ID",
                            flex:1,
                            dataIndex: 'id',
                            hidden:true
                        },
                        {
                            header: this.T("first_name"),
                            width:150,
                            dataIndex: 'first_name'
                        },
                        {
                            header: this.T("last_name"),
                            flex:1,
                            width:150,
                            dataIndex: 'last_name'
                        },
                        {
                            header: this.T("second_name"),
                            flex:1,
                            width:150,
                            dataIndex: 'second_name'
                        },
                        {
                            header: this.T("social_card_number"),
                            flex:1,
                            dataIndex: 'social_card_number'
                        },
                        {
                            header: this.T("passport_number"),
                            flex:1,
                            dataIndex: 'passport_number'
                        },
                        {
                            header:this.T("date_of_birth"),
                            flex:1,
                            dataIndex: 'date_of_birth',
                            renderer: Ext.util.Format.dateRenderer('d/m/Y')
                        },
                        {
                            header:this.T("address"),
                            flex:1,
                            width:200,
                            dataIndex: 'address'
                        },
                        {
                            header:this.T("death_certificate"),
                            flex:1,
                            width:200,
                            dataIndex: 'death_certificate',
                            hidden: true
                        }
                    ],
                    bbar:{
                        xtype: 'pagingtoolbar',
                        store:naturalContactsStore,
                        displayInfo: true,
                        displayMsg: this.T('displayMessage'),
                        emptyMsg: this.T('noResult')
                    }
                }
            ]
        });
        this.callParent(arguments);
    }
});
