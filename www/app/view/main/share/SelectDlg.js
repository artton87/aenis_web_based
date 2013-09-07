Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Aenis.store.main.Shares'
]);

Ext.define('Aenis.view.main.share.SelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainShareSelectDlg',

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
        'Locale.hy_AM.main.share.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        var vehicleStore = Ext.create('Aenis.store.main.Shares');

        Ext.apply(this, {
            title: this.T("shares"),

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
                            name:'juridical_person',
                            fieldLabel:this.T('juridical_person'),
                            flex:1,
                            emptyText:this.T("juridical_person_empty_text")
                        },
                        {
                            xtype:'textfield',
                            name:'natural_person',
                            fieldLabel:this.T('natural_person'),
                            flex:1,
                            emptyText:this.T("natural_person_empty_text")
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
                    ref:'shareGrid',
                    height:200,
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
                            header: this.T("id"),
                            width: 30,
                            flex:1,
                            dataIndex: 'id'
                        },
                        {
                            header: this.T("natural_person"),
                            width: 170,
                            flex:2,
                            dataIndex: 'natural_person'
                        },{
                            header: this.T("juridical_person"),
                            width: 170,
                            flex:2,
                            dataIndex: 'juridical_person'
                        },{
                            header: this.T("share"),
                            width: 170,
                            flex:2,
                            dataIndex: 'share'
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

