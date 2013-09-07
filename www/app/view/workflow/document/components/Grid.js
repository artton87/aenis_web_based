Ext.require([
	'BestSoft.grid.Panel'
]);

Ext.define('Aenis.view.workflow.document.components.Grid', {
	extend: 'BestSoft.grid.Panel',
	alias: 'widget.workflowDocumentGrid',

	mixins: [
		'Locale.hy_AM.Common',
		'Locale.hy_AM.workflow.document.components.Grid',
		'BestSoft.mixin.Localized'
	],

	initComponent: function() {

		Ext.applyIf(this, {
			tools: [],
			//store: store,
			autoLoadStore: false,
			columns: [
				{
					text: this.T('id'),
					dataIndex: 'id',
					hidden: true,
					width: 50
				},
				{
					text: this.T('doc_type'),
					dataIndex: 'doc_type_label',
					hidden: false,
					flex: 1
				},
				{
					text: this.T('place'),
					dataIndex: 'doc_num_in_case'
				},
				{
					text: this.T('page_count'),
					dataIndex: 'page_count'
				},
				{
					text: this.T('attached'),
					hidden: true,
					dataIndex: 'attached'
				}
			]
		});
		this.callParent(arguments);
	}
});
