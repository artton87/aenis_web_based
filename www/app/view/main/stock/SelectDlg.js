Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Aenis.store.main.Stocks'
]);

Ext.define('Aenis.view.main.stock.SelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainStockSelectDlg',

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
        'Locale.hy_AM.main.stock.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        var stockStore = Ext.create('Aenis.store.main.Stocks');

        Ext.apply(this, {
            title: this.T("stocks"),

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
                            name: 'name',
                            flex:1,
                            fieldLabel:this.T('name'),
                            allowBlank: false
                        },
                        {
                            xtype:'textfield',
                            name: 'surname',
                            flex:1,
                            fieldLabel:this.T('surname'),
                            allowBlank: false
                        },
                        {
                            xtype:'textfield',
                            name: 'organization_name',
                            flex:1,
                            fieldLabel:this.T('organization_name'),
                            allowBlank: false
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
                    ref: 'stockGrid',
                    height:100,
                    flex:1,
                    minWidth:700,
                    store:stockStore,
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
                            dataIndex: 'id'
                        },
                        {
                            header: this.T("name"),
                            width: 170,
                            flex:2,
                            dataIndex: 'name'
                        },
                        {
                            header: this.T("surname"),
                            width: 170,
                            flex:2,
                            dataIndex: 'surname'
                        },
                        {
                            header: this.T("organization_name"),
                            width: 170,
                            flex:2,
                            dataIndex: 'organization_name'
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

