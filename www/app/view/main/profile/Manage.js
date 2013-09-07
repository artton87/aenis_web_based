Ext.require([
    'Aenis.view.workflow.onlineApplications.components.Grid',
    'Aenis.view.workflow.will.components.Grid',
    'Aenis.view.workflow.warrant.components.Grid',
    'Aenis.view.workflow.contract.components.Grid',
    'Aenis.view.workflow.inheritance.application.components.Grid',
    'Aenis.view.workflow.inheritance.components.Grid'
]);


Ext.define('Aenis.view.main.profile.Manage', {
    extend: 'Ext.container.Container',

    alias: 'widget.mainProfileManage',

    layout: 'border',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.profile.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    statusIconColumnRenderer: function(value/*, metadata, record*/){
        return '<div class="transaction_status transaction_status-'+value+'"></div>';
    },


    initComponent: function() {

        this.loadStyleSheets();

        Ext.apply(this, {
            tabConfig: {
                title: this.T("viewTabTitle")
            },
            items: [
                {
                    xtype:'panel',
                    region: 'west',
                    split:true,
                    collapsible: true,

                    items:[
                        {
                            xtype: 'form',
                            ref:'detailsForm',
                            border: false,
                            layout:{
                                type:'vbox',
                                align:'stretch'
                            },
                            defaults:{
                                margin:10
                            },
                            items:[
                                {
                                    xtype:'datefield',
                                    name:'start_date',
                                    dateFormat:'Y/m/d',
                                    fieldLabel: this.T('start_date')
                                },
                                {
                                    xtype:'datefield',
                                    name:'end_date',
                                    dateFormat:'Y/m/d',
                                    fieldLabel: this.T('end_date')
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
                                            xtype: 'button',
                                            iconCls: 'icon-view',
                                            text: this.T('view'),
                                            ref: 'viewTransactions'
                                        }
                                    ]

                                },
                                {
                                    xtype: 'datepicker',
                                    margin: '0 0 10 5',
                                    ref:'calendarPicker',
                                    cls: 'ext-cal-nav-picker',
                                    dateFormat:'Y/m/d'
                                }
                            ]
                        }
                    ]

                },
                {
                    xtype:'panel',
                    region:'center',
                    flex: 1,
                    layout:'fit',
                    items:[
                        {
                            xtype:'tabpanel',
                            plugins: Ext.create('Ext.ux.TabReorderer'),
                            enableTabScroll: true,
                            deferredRender: false,
                            plain: true,
                            layout:'fit',
                            flex: 1,
                            items:[
                                {
                                    layout:'fit',
                                    flex: 1,
                                    title: this.T('online_applications'),
                                    xtype: 'workflowOnlineApplicationsGrid',
                                    ref:'onlineApplicationsGrid'//,
                                    //autoLoadStore: true
                                },
                                {
                                    title: this.T('wills'),
                                    xtype: 'workflowWillGrid',
                                    ref:'willsGrid',

                                    columns: [
                                        {
                                            width: 27,
                                            dataIndex: 'tr_status_code',
                                            resizable: false,
                                            hideable: false,
                                            renderer: this.statusIconColumnRenderer,
                                            alignTo: 'center'
                                        },
                                        {
                                            text: this.T('id'),
                                            dataIndex: 'id',
                                            hidden: true,
                                            width: 70
                                        },
                                        {
                                            text: this.T('tr_status'),
                                            flex: 1,
                                            dataIndex: 'tr_status_title'
                                        },
                                        {
                                            text: this.T('transaction_code'),
                                            flex: 1,
                                            dataIndex: 'transaction_code'
                                        },
                                        {
                                            text: this.T('case_code'),
                                            width:80,
                                            dataIndex: 'case_code'
                                        },
                                        {
                                            text: this.T('tr_type'),
                                            flex: 2,
                                            dataIndex: 'tr_type_label'
                                        },

                                        {
                                            text: this.T('notary'),
                                            flex: 1,
                                            dataIndex: 'notary'
                                        },

                                        {
                                            text: this.T('lu_user'),
                                            flex: 1,
                                            dataIndex: 'lu_user'
                                        },
                                        {
                                            xtype: 'datecolumn',
                                            format: Ext.util.Format.dateFormat+" H:i",
                                            text: this.T('lu_date'),
                                            width: 110,
                                            dataIndex: 'lu_date'
                                        }
                                    ]
                                    // autoLoadStore: true,

                                },
                                {
                                    title: this.T('warrants'),
                                    xtype: 'workflowWarrantGrid',
                                    ref:'warrantsGrid'
                                    //autoLoadStore: true
                                },
                                {
                                    title: this.T('contracts'),
                                    xtype: 'workflowContractGrid',
                                    ref:'contractsGrid'//,
                                    //autoLoadStore: true
                                },
                                {
                                    title: this.T('inheritance_application'),
                                    xtype: 'workflowInheritanceApplicationsGrid',
                                    ref:'inheritanceApplicationsGrid'//,
                                    //autoLoadStore: true
                                },
                                {
                                    title: this.T('inheritance'),
                                    xtype: 'workflowInheritanceGrid',
                                    ref:'inheritancesGrid'//,
                                    //autoLoadStore: true
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
