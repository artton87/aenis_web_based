Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Ext.form.field.ComboBox'
]);

Ext.define('Aenis.view.main.contact.juridical.AddEditDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainContactJuridicalAddEditDlg',

    modal: true,
    closeAction: 'destroy',
    maximizable: true,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.juridical.AddEdit',
        'BestSoft.mixin.Localized'
    ],

    layout: {
        type:'fit'
    },
    border:false,

    initComponent: function() {
        Ext.apply(this, {
            ref: 'juridicalContactPanel',
            title: this.T('add_juridical_contact'),
            items:[
                {
                    xtype:'form',
                    ref: 'addJuridicalForm',
                    layout: {
                        type:'vbox',
                        align:'center'
                    },
                    messages:{
                        "add_juridical_contact_title":this.T("add_juridical_contact"),
                        "edit_juridical_contact_title":this.T("edit_juridical_contact"),
                        createSuccess: this.T("msg_create_success"),
                        updateSuccess: this.T("msg_update_success")
                    },
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        margin: 10,
                        msgTarget: 'side',
                        labelWidth: 120
                    },
                    items:[
                        {
                            xtype:'container',
                            layout:{
                                'type':'hbox',
                                'align':'stretch'
                            },
                            items:[
                                {
                                    xtype:'fieldcontainer',
                                    layout:{
                                        type:'vbox',
                                        align:'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'organization_name',
                                            afterLabelTextTpl: BestSoft.required,
                                            flex:1,
                                            fieldLabel:this.T('organization_name'),
                                            allowBlank:false
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'registration_number',
                                            flex:1,
                                            fieldLabel:this.T('registration_number')
                                        },
                                        {
                                            xtype: 'datefield',
                                            name: 'foundation_date',
                                            flex:1,
                                            fieldLabel:this.T('foundation_date')
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'phone',
                                            flex:1,
                                            fieldLabel:this.T('phone')
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'website',
                                            flex:1,
                                            fieldLabel:this.T('website')
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldcontainer',
                                    flex:5,
                                    layout:{
                                        type:'vbox',
                                        align:'stretch'
                                    },
                                    items:[
                                        /*{
                                            xtype:'combobox',
                                            ref: 'juridicalTypes',
                                            allowBlank: false,
                                            name:'organization_type_id',
                                            margin:5,
                                            labelWidth:150,
                                            fieldLabel:this.T("organization_type"),
                                            store: Ext.create('Aenis.store.main.contact.juridical.Types'),
                                            queryMode: 'local',
                                            emptyText: this.T('select_organization_type'),
                                            displayField: 'name',
                                            valueField:'id',
                                            editable:false,
                                            forceSelection:true
                                        },*/
                                        {
                                            xtype: 'textfield',
                                            name: 'organization_type_short_name',
                                            flex:1,
                                            fieldLabel:this.T('organization_type_short_name'),
                                            afterLabelTextTpl: BestSoft.required
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'organization_type_long_name',
                                            flex:1,
                                            fieldLabel:this.T('organization_type_long_name'),
                                            afterLabelTextTpl: BestSoft.required
                                        },


                                        {
                                            xtype: 'textfield',
                                            name: 'tax_account',
                                            flex:1,
                                            fieldLabel:this.T('tax_account'),
                                            afterLabelTextTpl: BestSoft.required
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'certificate_number',
                                            flex:1,
                                            fieldLabel:this.T('certificate_number')
                                        },
                                        {
                                            xtype:'textfield',
                                            name:'fax',
                                            fieldLabel:this.T("fax"),
                                            flex:1
                                        },
                                        {
                                            xtype:'textfield',
                                            name:'email',
                                            fieldLabel:this.T("email"),
                                            emptyText:this.T("email"),
                                            flex:1
                                        },
                                        {
                                            xtype:'hidden',
                                            name:'contact_id'
                                        },
                                        {
                                            xtype:'hidden',
                                            name:'contact_type',
                                            value:2
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype:'hidden',
                            name:'storage',
                            value:'from_db'
                        },
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox',
                                align:'stretch'
                            },
                            items: [
                                {
                                    xtype:'textfield',
                                    ref: 'countryLabel',
                                    flex:1,
                                    fieldLabel:this.T("country"),
                                    name:'country_label'
                                },
                                {
                                    xtype:'button',
                                    flex:1,
                                    text:this.T("select"),
                                    iconCls:'icon-browse',
                                    action:'selectCountry'
                                },
                                {
                                    xtype:'hidden',
                                    ref: 'countryId',
                                    name:'country_id'
                                }
                            ]
                        },
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox',
                                align:'stretch'
                            },
                            items: [
                                {
                                    xtype:'textarea',
                                    name:'address',
                                    flex:1,
                                    width:400,
                                    fieldLabel:this.T("address")
                                }
                            ]
                        },
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox',
                                align:'stretch'
                            },
                            items: [
                                {
                                    xtype:'textarea',
                                    width:400,
                                    flex:1,
                                    fieldLabel:this.T("additional_information"),
                                    name:'additional_information'
                                }
                            ]
                        }
                    ]
                }
            ],
            buttons:[
                {
                    xtype: 'bsbtnAdd',
                    ref: 'addAction',
                    iconCls: 'icon-add'
                },
                {
                    xtype: 'bsbtnSave',
                    ref: 'saveAction',
                    iconCls:'icon-save'
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
