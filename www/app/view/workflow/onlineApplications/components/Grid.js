Ext.require([
    'BestSoft.grid.Panel',
    'Ext.toolbar.Paging',
    'Ext.grid.column.Date',
    'Aenis.store.workflow.Warrants'
]);

Ext.define('Aenis.view.workflow.onlineApplications.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowOnlineApplicationsGrid',

    styleSheets: [
        'workflow/transaction/Grid.css'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.onlineApplications.components.Grid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    statusIconColumnRenderer: function(value/*, metadata, record*/){
        return '<div class="transaction_status transaction_status-'+value+'"></div>';
    },

    initComponent: function() {
        this.loadStyleSheets();
        var me = this;
        var store = this.store || Ext.create('Aenis.store.workflow.OnlineApplications');
        Ext.applyIf(store.proxy.extraParams, {
            view_uid: me.getId()
        });
        Ext.applyIf(this, {
            tools: [],
            store: store,
            autoLoadStore: false,
            title: this.T("onlineApplications"),

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
                    text: this.T('status'),
                    dataIndex:'status',
                    width:80
                },
                {
                    text: this.T('id'),
                    dataIndex:'id',
                    width:50
                },
                {
                    text: this.T('app_id'),
                    dataIndex:'app_id',
                    width:100
                },
                {
                    text: this.T('application_type'),
                    dataIndex:'application_type',
                    flex:1
                },
                {
                    text: this.T('customer'),
                    dataIndex:'customer',
                    flex:1
                },

                {
                    text: this.T('input_date'),
                    dataIndex:'input_date',
                    flex:1
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store,
                displayInfo: true,
                displayMsg: this.T('pagingtoolbar_displayMessage'),
                emptyMsg: this.T('pagingtoolbar_emptyMessage')
            }
        });
        this.callParent(arguments);
    }
});
