Ext.require([
    'BestSoft.grid.Panel',
    'Ext.toolbar.Paging',
    'Ext.form.Panel',
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.FieldContainer',
    'Ext.form.RadioGroup',
    'Aenis.store.main.contact.Juridical'
]);

Ext.define('Aenis.view.main.contact.components.Juridical', {
    extend:'Ext.panel.Panel',
    alias: 'widget.main.contact.Juridical',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.components.Juridical',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        var juridicalContactsStore = Ext.create('Aenis.store.main.contact.Juridical');
        Ext.apply(this, {
            items: [
                {
                    xtype:'form',
                    ref: 'juridicalSearchForm',
                    layout:{
                        type:'vbox',
                        align:'center'
                    },
                    header: false,
                    defaults: {
                        margin: 5
                    },
                    messages: {
                        organization_name_is_empty: this.T('organization_name_is_empty'),
                        tax_account_is_empty: this.T('tax_account_is_empty'),
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
                                align: 'left'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'organization_name',
                                    fieldLabel: this.T("name"),
                                    labelAlign:'right',
                                    labelWidth:130,
                                    width: 670
                                },
                                {
                                    xtype:'fieldcontainer',
                                    layout:{
                                        type: 'hbox'
                                    },
                                    fieldDefaults: {
                                        labelAlign:'right'
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            name:'registration_number',
                                            fieldLabel:this.T("registration_number"),
                                            width: 260,
                                            labelWidth:130,
                                            flex:1
                                        },
                                        {
                                            xtype:'textfield',
                                            name: 'tax_account',
                                            fieldLabel:this.T("tax_account"),
                                            width: 410,
                                            labelWidth:270,
                                            flex:1,
                                            maxLength: 8,
                                            enforceMaxLength: true,
                                            vtype:'am_tax_account'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            ref: 'searchPlaces',
                            fieldLabel: this.T("search_place"),
                            labelWidth: 110,
                            labelAlign: 'right',
                            columns:2,
                            items:[
                                {
                                    name: 'storage',
                                    boxLabel: this.T("from_database"),
                                    inputValue: 'from_db',
                                    width:100
                                },
                                {
                                    name: 'storage',
                                    width: 170,
                                    inputValue: 'from_e_register',
                                    boxLabel: this.T("from_e_register"),
                                    checked: true
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
                    ref: 'juridicalContactsGrid',
                    height: 200,
                    flex:1,
                    store:juridicalContactsStore,
                    columns: [
                        {
                            header: "ID",
                            flex:1,
                            dataIndex: 'id',
                            hidden:true
                        },
                        {
                            header: this.T("name"),
                            dataIndex: 'organization_name',
                            width:250
                        },
                        {
                            header: this.T("organization_type_short_name"),
                            dataIndex: 'organization_type_short_name',
                            flex:1
                        },
                        {
                            header: this.T("organization_type_long_name"),
                            dataIndex: 'organization_type_long_name',
                            flex:1
                        },
                        {
                            header: this.T("registration_number"),
                            dataIndex: 'registration_number',
                            flex:1
                        },
                        {
                            header: this.T("tax_id"),
                            dataIndex: 'tax_account',
                            flex:1
                        },
                        {
                            header: this.T("address"),
                            dataIndex: 'address',
                            flex:1
                        }
                    ],
                    bbar:{
                        xtype: 'pagingtoolbar',
                        store:juridicalContactsStore,
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

