Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Aenis.store.main.Realty'
]);

Ext.define('Aenis.view.main.realty.SelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainRealtySelectDlg',

    modal: true,
    maximizable:true,
    closeAction: 'destroy',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.realty.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        var realtyStore = Ext.create('Aenis.store.main.Realty');

        Ext.apply(this, {
            title: this.T("estate"),

            items: [
                {
                    xtype:'form',
                    ref: 'searchForm',
                    title:this.T('search_parameters'),
                    layout:{
                        type:'hbox',
                        align:'stretch'
                    },
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        margin: '5px'
                    },
                    defaultType: 'textfield',
                    items:[
                        {
                            xtype:'textfield',
                            name: 'certificate_number',
                            flex:1,
                            fieldLabel:this.T('certificate_number')
                        }
                    ],
                    bbar: [
                        '->',
                        {
                            formBind: true,
                            text:this.T("search"),
                            action:'search',
                            iconCls: 'icon-search'
                        },
                        '->'
                    ]
                },
                {
                    xtype: 'bsgrid',
                    autoLoadStore:false,
                    title:this.T('results'),
                    ref:'realtyGrid',
                    height:100,
                    flex:1,
                    minWidth:700,
                    store:realtyStore,
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'center'
                    },
                    columns: [
                        {
                            header: this.T("id"),
                            width: 30,
                            flex:1,
                            dataIndex: 'id',
                            hidden:true
                        },
                        {
                            header: this.T("certificate_number"),
                            width: 170,
                            flex:2,
                            dataIndex: 'certificate_number'
                        },
                        {
                            header: this.T("given_date"),
                            width: 170,
                            flex:2,
                            dataIndex: 'given_date',
                            hidden:true
                        },
                        {
                            header: this.T("address"),
                            width: 170,
                            flex:2,
                            dataIndex: 'address'
                        },
                        {
                            header: this.T("parcel_codes"),
                            width: 170,
                            flex:2,
                            dataIndex: 'parcel_codes',
                            hidden:true
                        },
                        {
                            header: this.T("building_codes"),
                            width: 170,
                            flex:2,
                            dataIndex: 'building_codes',
                            hidden:true
                        },
                        {
                            header: this.T("parcel_total_area"),
                            width: 170,
                            flex:2,
                            dataIndex: 'parcel_total_area'
                        },
                        {
                            header: this.T("building_total_area"),
                            width: 170,
                            flex:2,
                            dataIndex: 'building_total_area'
                        }
                    ]
                },
                {
                    xtype:'form',
                    hidden:false,
                    ref:'customFields',
                    layout:{
                        type:'vbox',
                        align:'stretch'
                    },
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        margin: '10px'
                    },
                    flex:1,
                    items:[
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox',
                                align:'center'
                            },
                            fieldDefaults: {
                                labelAlign: 'top',
                                anchor: '100%',
                                margin: '3px'
                            },
                            items:
                            [
                                {
                                    fieldLabel:this.T('address'),
                                    xtype:'textfield',
                                    flex:1,
                                    name:'address',
                                    afterLabelTextTpl:BestSoft.required,
                                    allowBlank: false
                                },
                                {
                                    fieldLabel:this.T('certificate_number'),
                                    xtype:'textfield',
                                    flex:1,
                                    name:'certificate_number',
                                    afterLabelTextTpl:BestSoft.required,
                                    allowBlank: false
                                }
                            ]
                        },
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox',
                                align:'center'
                            },
                            fieldDefaults: {
                                labelAlign: 'top',
                                anchor: '100%',
                                margin: '2px'
                            },
                            items:[
                                {
                                    fieldLabel:this.T("building_total_area"),
                                    xtype:'numberfield',
                                    flex:1,
                                    name:'building_total_area',
                                    afterLabelTextTpl:BestSoft.required,
                                    allowBlank: false
                                },
                                {
                                    fieldLabel:this.T("building_type"),
                                    xtype:'textfield',
                                    flex:1,
                                    name:'building_type',
                                    afterLabelTextTpl:BestSoft.required,
                                    allowBlank: false
                                }
                            ]
                        },
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox',
                                align:'center'
                            },
                            fieldDefaults: {
                                labelAlign: 'top',
                                anchor: '100%',
                                margin: '2px'
                            },
                            items:[

                                {
                                    fieldLabel:this.T('description'),
                                    xtype:'textarea',
                                    flex:1,
                                    name:'description'
                                }
                            ]
                        }
                    ]
                }
            ],
            buttons: [
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

