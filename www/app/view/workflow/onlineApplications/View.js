Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.layout.container.Border',
    'Ext.toolbar.Paging',
    'Ext.form.field.Checkbox',
    'Ext.toolbar.Paging',
    'Aenis.view.workflow.template.components.Editor',
    'Aenis.view.main.contact.components.SelectionGrid',
    'Aenis.view.workflow.object.components.SelectionGrid',
    'Aenis.view.workflow.file.components.SelectionGrid',
    'Aenis.view.workflow.template.components.Editor',
    'Aenis.store.workflow.application.Messages',
    'Aenis.view.workflow.onlineApplications.components.Grid'
]);

Ext.define('Aenis.view.workflow.onlineApplications.View', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowOnlineApplicationsView',

    layout: {
        type: 'border'
    },

    styleSheets: [
        'workflow/transaction/Grid.css',
        'workflow/onlineApplications/messages/Grid.css'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.onlineApplications.View',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    layout: {
        type: 'border'
    },

    statusIconColumnRenderer: function(value/*, metadata, record*/){
        return '<div class="transaction_status transaction_status-'+value+'"></div>';
    },

    initComponent: function() {
        this.loadStyleSheets();

        var store = Ext.create('Aenis.store.workflow.OnlineApplications');

        var messagesStore =  Ext.create('Aenis.store.workflow.application.Messages');

        Ext.apply(this, {
            tabConfig: {
                title: this.T("onlineApplicationsTabTitle")
            },
            items:[
                {
                    xtype:'form',
                    region: 'north',
                    ref:'onlineApplicationPanelForm',
                    url:'workflow/onlineApplications/approve.php',
                    layout:{
                        type:'vbox',
                        align:'stretch'
                    },
                    messages:{
                        updateSuccess:this.T("application_accepted")
                    },
                    autoScroll:true,
                    split: true,
                    border: false,
                    flex:1,

                    items:[
                        {
                            xtype:'container',
                            layout:{
                                type:'hbox'
                            },
                            items:[
                                {
                                    xtype:'tabpanel',
                                    ref:'onlineApplicationTabPanel',
                                    hidden:true,
                                    deferredRender: false,
                                    enableTabScroll: true,
                                    plain: true,
                                    flex: 1,


                                    items:[
                                        {
                                            xtype:'container',
                                            title:this.T('parties_objects_documents'),

                                            layout:{
                                                type:'hbox',
                                                align:'center',
                                                pack:'center'
                                            },
                                            items:[
                                                {
                                                    xtype:'container',
                                                    ref:'onlineApplicationPartiesPanel',
                                                    layout:{
                                                        type:'vbox',
                                                        align:'stretch'
                                                    },
                                                    height:300,
                                                    margin:'0 0 10 0',
                                                    autoScroll: true,
                                                    items:[]
                                                },
                                                {
                                                    xtype:'container',
                                                    layout:{
                                                        type:'vbox',
                                                        align:'stretch'
                                                    },
                                                    items:[
                                                        {
                                                            xtype:'container',
                                                            ref:'onlineApplicationObjectsPanel',
                                                            layout:{
                                                                type:'hbox'
                                                            },
                                                            items:[]
                                                        },
                                                        {
                                                            xtype:'container',
                                                            ref:'onlineApplicationDocumentsPanel',
                                                            layout:{
                                                                type:'hbox'
                                                            },
                                                            items:[]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype:'container',
                                            title: this.T('approve_reject_application'),
                                            ref:'approveRejectApplicationTab',
                                            layout:{
                                                type: 'vbox',
                                                align: 'stretch'
                                            },
                                            flex:1,
                                            items:[
                                                {
                                                    xtype:'fieldcontainer',
                                                    layout:{
                                                        type: 'vbox',
                                                        align: 'center'
                                                    },
                                                    items:[
                                                        {
                                                            xtype: 'checkbox',
                                                            boxLabel: this.T("approve_application"),
                                                            name: 'approve_application',
                                                            inputValue: 1,
                                                            margin: '5 5 5 10',
                                                            ref: 'confirmed'
                                                        },
                                                        {
                                                            xtype:'fieldcontainer',
                                                            ref:'meetingDateForm',
                                                            layout:{
                                                                type:'hbox'
                                                            },
                                                            hidden: true,
                                                            defaults:{
                                                                labelWidth: 150
                                                            },
                                                            items:[
                                                                {
                                                                    xtype:'datefield',
                                                                    name:'application_date',
                                                                    dateFormat:'Y/m/d',
                                                                    fieldLabel: this.T('application_date'),
                                                                    minValue:Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
                                                                    margin:10

                                                                },
                                                                {
                                                                    xtype: 'timefield',
                                                                    fieldLabel: this.T('application_time'),
                                                                    name: 'application_time',
                                                                    margin:10,
                                                                    minValue: '9:00am',
                                                                    maxValue: '6:00pm'

                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'bsgrid',
                                                    autoLoadStore: false,
                                                    store: messagesStore,
                                                    ref:'onlineApplicationMessagesGrid',
                                                    disableSelection: true,
                                                    title: this.T('messages'),
                                                    resizable: true,
                                                    resizeHandles:'s e se',
                                                    loadMask: true,
                                                    flex: 1,
                                                    viewConfig:{
                                                        stripeRows: false,
                                                        enableTextSelection: false
                                                    },
                                                    columns:[
                                                        {
                                                            dataIndex:'message_date',
                                                            text:this.T("message_date"),
                                                            renderer : Ext.util.Format.dateRenderer('m/d/Y H:i:s'),
                                                            alignTo:'right',
                                                            width:150,
                                                            tdCls: 'x-change-cell'
                                                        },
                                                        {
                                                            dataIndex:'author',
                                                            text:this.T('author'),
                                                            width:250,
                                                            tdCls: 'x-change-cell'
                                                        },
                                                        {
                                                            dataIndex:'message',
                                                            text:this.T('message'),
                                                            flex:1,
                                                            tdCls: 'x-change-cell-message'
                                                        }
                                                    ],
                                                    tbar:[
                                                        {
                                                            xtype: 'button',
                                                            ref: 'viewPrevious',
                                                            iconCls: 'icon-previous',
                                                            tooltip: this.T('view_previous')
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype:'form',
                                                    ref:'messageForm',
                                                    layout:{
                                                        type:'hbox',
                                                        align:'center'
                                                    },
                                                    border: false,
                                                    flex:1,
                                                    items:[
                                                        {
                                                            xtype:'textarea',
                                                            name:'message',
                                                            enableKeyEvents: true,
                                                            flex: 1,
                                                            emptyText: this.T('type_message'),
                                                            margin:'10 0'//,
                                                            //allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'bsbtnAdd',
                                                            ref: 'addMessageAction',
                                                            text:this.T('send'),
                                                            margin:'20 0',
                                                            scale: 'large'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype:'container',
                                                    layout:{
                                                        type:'hbox',
                                                        align:'center',
                                                        pack:'center'
                                                    },
                                                    items:[
                                                        {
                                                            xtype: 'bsbtnReset',
                                                            ref:'resetAction',
                                                            margin: '0 10'
                                                        },
                                                        {
                                                            xtype:'button',
                                                            iconCls:'icon-save',
                                                            text:this.T('save'),
                                                            ref:'saveAction',
                                                            disabled: true
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'workflowOnlineApplicationsGrid',
                    region:'center',
                    autoLoadStore: true,
                    height:300,
                    ref: 'onlineApplicationsGrid',
                    store: store,


                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: store,
                        displayInfo: true,
                        displayMsg: this.T('pagingtoolbar_displayMessage'),
                        emptyMsg: this.T('pagingtoolbar_emptyMessage')
                    },
                    tbar:[
                        {
                            xtype:'button',
                            iconCls:'icon-view',
                            text:this.T('view'),
                            ref:'viewAction',
                            disabled: true
                        },

                        '->',
                        {
                            xtype:'combo',
                            ref: 'transactionStatuses',
                            inputWidth: 180,
                            store: Ext.create('Aenis.store.workflow.transaction.Statuses'),
                            queryMode: 'local',
                            emptyText: this.T("transaction_statuses"),
                            displayField: 'title',
                            valueField: 'id',
                            editable: false,
                            forceSelection: true,
                            submitValue: false
                        },
                        '->',
                        {
                            xtype:'button',
                            iconCls:'icon-view',
                            text:this.T('view_transaction'),
                            ref:'viewTransactionAction',
                            hidden: true
                        }
                    ]
                }
            ]
        });
        this.callParent(arguments);
    }

});
