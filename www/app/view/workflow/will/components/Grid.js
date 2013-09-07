Ext.require([
    'BestSoft.grid.Panel',
    'Ext.toolbar.Paging',
    'Ext.grid.column.Date',
    'Aenis.store.workflow.Contracts'
]);

Ext.define('Aenis.view.workflow.will.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowWillGrid',

    styleSheets: [
        'workflow/transaction/Grid.css'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.will.components.Grid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    initComponent: function() {
        this.loadStyleSheets();
        var me = this;
        var store = this.store || Ext.create('Aenis.store.workflow.Wills');
        Ext.applyIf(store.proxy.extraParams, {
            view_uid: me.getId()
        });
        Ext.applyIf(this, {
            tools: [],
            store: store,
            ref: 'willsGrid',

            autoLoadStore: false,
            viewConfig: {
                getRowClass: function(record) {
                    return record.get('locked_user_id') > 0 ? 'locked' : '';
                }
            },
            messages: {
                locked_by_user: this.T("msg_locked_by_user")
            },
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
