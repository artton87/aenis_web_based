Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.layout.container.Border',
    'Aenis.view.workflow.contract.components.Grid'
]);

Ext.define('Aenis.view.workflow.contract.View', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowContractView',

	layout: {
        type: 'border'
    },

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.contract.View',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("transactions")
            },

            items: [
                {
                    xtype: 'workflowContractGrid',
                    ref: 'contractsGrid',
                    region: 'north',
                    split: true,
                    collapsible: true,
                    title: this.T('transactions'),
                    height: 200
                },
                {
                    title: this.T('View_title'),
                    xtype: 'form',
                    ref: 'transactionDetailsForm',
                    region: 'center',
                    height: '75%',
                    autoScroll: true,
                    bodyStyle: 'padding:10px 30px',
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        margin: '10px 0'
                    },

                    defaultType: 'textfield',

                    items: [
                        {
                            xtype:'tabpanel',
                            activePanel: 0,
                            enableTabScroll: true,
                            deferredRender: false,
                            plain: true,
                            defaults: {
                                minHeight: 250
                            },
                            items:[
                                {
                                    ref: 'mainFormTransactionTab',
                                    border: false,
                                    title: this.T("details"),
                                    layout: {
                                        type: 'hbox',
                                        pack: 'center',
                                        align: 'stretch'
                                    },
                                    partyConfig:{
                                        xtype:'container',
                                            layout:{
                                            type:'hbox'
                                        },
                                        items:[
                                            {
                                                xtype:'bsgrid',
                                                itemId:'partiesGrid',
                                                autoLoadStore:false,
                                                resizable: true,
                                                width:300,
                                                margin: "10 10 0 0",
                                                resizeHandles: 's e se',
                                                tools:[],
                                                collapsible:true,
                                                columns: [
                                                    {
                                                        text: this.T('Name'),
                                                        flex: 1,
                                                        dataIndex: 'contactName'
                                                    }
                                                ]

                                            }
                                        ]
                                    },
                                    objectConfig:{
                                        xtype:'container',
                                            layout:{
                                            type:'hbox'
                                        },
                                        items:[
                                            {
                                                xtype:'bsgrid',
                                                itemId:'objectsGrid',
                                                title: this.T('Objects'),
                                                autoLoadStore:false,
                                                resizable: true,
                                                width:300,
                                                margin: "10 10 0 0",
                                                resizeHandles: 's e se',
                                                tools:[],
                                                collapsible:true,
                                                columns: [
                                                    {
                                                        text: this.T('Obj_name'),
                                                        flex: 1,
                                                        dataIndex: 'objectName'
                                                    },
                                                    {
                                                        text: this.T('Obj_type'),
                                                        flex: 1,
                                                        dataIndex: 'objectTypeLabel'
                                                    }
                                                ]

                                            }
                                        ]
                                    },
                                    items:[
                                        {

                                        }
                                    ]
                                },
                                {
                                    title: this.T("content"),
                                    ref: 'contentTab',
                                    border: false,
                                    layout: {
                                        type: 'hbox',
                                        pack: 'center',
                                        align: 'stretch'
                                    },
                                    items:[
                                        {

                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
