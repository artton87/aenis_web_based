Ext.require([
    'BestSoft.grid.Panel',
    'Ext.toolbar.Paging',
    'Ext.grid.column.Date',
    'Aenis.store.workflow.Warrants'
]);

Ext.define('Aenis.view.workflow.warrant.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowWarrantGrid',

    styleSheets: [
        'workflow/transaction/Grid.css'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.warrant.components.Grid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    statusIconColumnRenderer: function(value/*, metadata, record*/){
        return '<div class="transaction_status transaction_status-'+value+'"></div>';
    },

    initComponent: function() {
        this.loadStyleSheets();
        var me = this;
        var store = this.store || Ext.create('Aenis.store.workflow.Warrants');
        Ext.applyIf(store.proxy.extraParams, {
            view_uid: me.getId()
        });
        Ext.applyIf(this, {
            tools: [],
            store: store,
            autoLoadStore: false,
            viewConfig: {
                getRowClass: function(record) {
                    return record.get('locked_user_id') > 0 ? 'locked' : '';
                }
            },
            messages: {
                locked_by_user: this.T("msg_locked_by_user")
            },
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
                    xtype:'booleancolumn',
                    text: this.T('is_paid'),
                    dataIndex: 'is_paid',
                    width: 70
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
                /*{
                    text: this.T('customer'),
                    flex: 2,
                    dataIndex: 'customer'
                },*/
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
