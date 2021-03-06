Ext.require([
	'BestSoft.grid.Panel'
]);

Ext.define('Aenis.view.workflow.document.page.Grid', {
	extend: 'BestSoft.grid.Panel',
	alias: 'widget.workflowDocumentPageGrid',

	mixins: [
		'Locale.hy_AM.Common',
		'Locale.hy_AM.workflow.document.Manage',
		'BestSoft.mixin.Localized'
	],
	initComponent: function() {
		Ext.applyIf(this, {
			tools: [],
			columns: [
				{
					text: this.T('id'),
					dataIndex: 'id',
					hidden: true
				},
				{
					text: this.T('page_number_in_document'),
					dataIndex: 'page_number_in_document',
					hidden: false
				},
				{
					text: this.T('page_size'),
					flex: 3,
					dataIndex: 'page_size'
				}
			]
		});
		this.callParent(arguments);
	}
});