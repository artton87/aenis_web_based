Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Aenis.store.main.Vehicles'
]);

Ext.define('Aenis.view.main.vehicle.SelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainVehicleSelectDlg',

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
        'Locale.hy_AM.main.vehicle.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        var vehicleStore = Ext.create('Aenis.store.main.Vehicles');

        Ext.apply(this, {
            title: this.T("vehicles"),

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
                            name: 'number',
                            flex:1,
                            fieldLabel:this.T('number'),
                            emptyText:this.T("example_number"),
                            regex: /^\d{2} *\-?[a-z]{2} *\-?\d{3}$/i,
                            maskRe:/[\da-z\- ]/i,
                            regexText: this.T("regexp_number_message")
                        },
                        {
                            name: 'vin',
                            flex:1,
                            fieldLabel:this.T('VIN'),
                            emptyText:this.T("example_vin")
                        }
                    ],
                    bbar: [
                        '->',
                        {
                            formBind: true,
                            text:this.T("search"),
                            action: 'search',
                            iconCls: 'icon-search'
                        },
                        '->'
                    ]
                },
                {
                    xtype: 'bsgrid',
                    autoLoadStore:false,
                    title:this.T('results'),
                    ref: 'vehiclesGrid',
                    height:90,
                    flex:1,
                    minWidth:700,
                    store:vehicleStore,
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'center'
                    },
                    columns: [
                        {
                            header:this.T("vin"),
                            width: 170,
                            flex:2,
                            dataIndex: 'vin'
                        },

                        {
                            header:this.T("body_type"),
                            width: 170,
                            flex:2,
                            dataIndex: 'body_type'
                        },
                        {
                            header:this.T("type"),
                            width: 170,
                            flex:2,
                            dataIndex: 'type'
                        },
                        {
                            header:this.T("number"),
                            width: 170,
                            flex:2,
                            dataIndex: 'number'
                        },
                        {
                            header:this.T("model"),
                            width: 170,
                            flex:2,
                            dataIndex: 'model'
                        },
                        {
                            header:this.T("model_year"),
                            width: 170,
                            flex:2,
                            dataIndex: 'model_year'
                        },
                        {
                            header:this.T("engine_number"),
                            width: 170,
                            flex:2,
                            dataIndex: 'engine_number'
                        },
                        {
                            header:this.T("color"),
                            width: 170,
                            flex:2,
                            dataIndex: 'color'
                        },
                        {
                            header:this.T("chassis_number"),
                            width: 170,
                            flex:2,
                            dataIndex: 'chassis_number'
                        },
                        {
                            header:this.T("brand"),
                            width: 170,
                            flex:2,
                            dataIndex: 'brand'
                        },
                        {
                            header:this.T("owner"),
                            width: 170,
                            flex:2,
                            dataIndex: 'owner'
                        }
                    ]
                },
                {
                    xtype:'form',
                    hidden:true,
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
                           items:[
                           {
                               fieldLabel:this.T("number"),
                               xtype:'textfield',
                               flex:1,
                               name:'number',
                               afterLabelTextTpl:BestSoft.required,
                               allowBlank: false,
                               regex: /^\d{2} *\-?[a-z]{2} *\-?\d{3}$/i,
                               maskRe:/[\da-z\- ]/i,
                               regexText: this.T("regexp_number_message")
                           },
                           {
                               fieldLabel:this.T("vin"),
                               xtype:'textfield',
                               flex:1,
                               name:'vin',
                               afterLabelTextTpl:BestSoft.required,
                               allowBlank: false
                           },
                           {
                               fieldLabel:this.T("color"),
                               xtype:'textfield',
                               flex:1,
                               name:'color'
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
                                   fieldLabel:this.T("model"),
                                   xtype:'textfield',
                                   flex:1,
                                   name:'model'
                               },
                               {
                                   fieldLabel:this.T("type"),
                                   xtype:'textfield',
                                   flex:1,
                                   name:'type'
                               },
                               {
                                   fieldLabel:this.T("model_year"),
                                   xtype:'numberfield',
                                   flex:1,
                                   name:'model_year',
                                   allowBlank: false,
                                   minValue:Ext.Date.format(new Date(), 'Y')-200,
                                   maxValue: Ext.Date.format(new Date(), 'Y')
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

