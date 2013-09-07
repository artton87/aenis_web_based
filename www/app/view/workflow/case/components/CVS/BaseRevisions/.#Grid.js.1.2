Ext.require([
    'BestSoft.grid.Panel',
    'Aenis.store.workflow.Cases'
]);

Ext.define('Aenis.view.workflow.case.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowCaseGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.case.components.Grid',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        var store = this.store || Ext.create('Aenis.store.workflow.Cases');
        Ext.applyIf(store.proxy.extraParams, {
            view_uid: me.getId()
        });
        Ext.applyIf(this, {
            tools: [],
            store: store,
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'id',
                    hidden: true,
                    width: 70
                },
				{
					text: this.T('case_code'),
					dataIndex: 'case_code',
					hidden: false,
					width: 170
				},
                {
					xtype: 'booleancolumn',
                    text: this.T('is_all_scanned'),
                    flex: 1,
                    dataIndex: 'is_all_scanned'
					//width: 170
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
