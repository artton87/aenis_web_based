Ext.require([
	'BestSoft.grid.Panel',
	'Ext.form.Panel',
	'Ext.form.ComboBox',
	'Ext.layout.container.Border',
	'Ext.form.FieldContainer',
	'Ext.form.field.Checkbox',
	'Aenis.store.workflow.party.Types',
	'Aenis.view.main.contact.components.SelectionGrid',
	'Aenis.view.workflow.object.components.SelectionGrid',
	'Aenis.view.workflow.transaction.components.PropertiesPanel'
]);

Ext.define('Aenis.view.workflow.contract.Search', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowContractSearch',

	layout: {
		type: 'border'
	},

	mixins: [
		'Locale.hy_AM.Common',
		'Locale.hy_AM.workflow.contract.Search',
		'BestSoft.mixin.Localized'
	],

	initComponent: function() {
		Ext.apply(this, {
			tabConfig: {
				title: this.T("contract_search")
			},
			items: [
				{
					xtype: 'container',
					region: 'north',
					layout:{
						type:'vbox'
						//align:'center',
						//pack:'center'
					},
					margin: '10 0 10 0',
					items: [
						{
							xtype: 'fieldcontainer',
							layout:{
								type:'hbox',
								align:'center',
								pack:'center'
							},
							items: [
								{
									xtype: 'textfield',
									fieldLabel: this.T('transaction_type'),
									labelAlign: 'right',
									labelWidth: 160,
									ref: 'transactionTypeField',
									width: 410,
									submitValue: false,
									readOnly: true
								},
								{
									xtype: 'button',
									text: this.T("select"),
									tooltip: this.T("transaction_type_select_tip"),
									iconCls: 'icon-browse',
									ref: 'selectTransactionTypeAction',
									margin: '0 0 0 10px'
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							layout:{
								type:'hbox',
								align:'center',
								pack:'center'
							},
							ref: 'partiesTopBar',
							hidden: true,
							items: [
								{
									xtype: 'combobox',
									fieldLabel: this.T('party_type'),
									labelAlign: 'right',
									labelWidth: 160,
									ref: 'partyTypesCombo',
									formExcluded: true,
									width: 410,
									queryMode: 'local',
									editable: false,
									valueField: 'party_type_id',
									displayField: 'party_type_label',
									forceSelection: true
								},
								{
									xtype:'bsbtnAdd',
									action:'addPartyTypeGrid',
									ref:'addPartyTypeGrid',
									margin: '0 10'
								}
							]
						}

					]
				},
				{
					xtype: 'form',
					region: 'center',
					//autoScroll:true,
					//title: this.T("contract_search"),
					ref: "detailsForm",
					border: false,
					disabled: true,
					split: true,
					layout: {
						type: 'border',
						align:'center',
						pack:'center'
					},
					loadingProgressStore: Ext.create('Ext.data.Store', {
						fields: [
							{type: 'string', name: 'loaded_item'}
						],
						proxy: {
							type: 'memory'
						}
					}),
					defaults:{
						margin: 5
					},
					items: [
						{
							region: 'north',
							xtype: 'textfield',
							fieldLabel: this.T('transaction_code'),
							labelAlign: 'right',
							name: 'transaction_code',
							labelWidth: 160,
							inputWidth: 240,
							margin: '0 0 10 0'
						},
						{
							//xtype: 'panel',
							region: 'center',
							title: this.T("parties"),
							ref: 'partiesPanel',
							msgSubjectExists: this.T("existing_subject"),
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							autoScroll: true,
							height: 350,
							//width:400,
							flex: 1,
							//border: false,
							partyComponentConfig: {
								xtype: 'mainContactSelectionGrid',
								margin: '1 2',
								resizeHandles: 'w e',
								width: 400,
								flex: 1,
								params: {mode:'search'}
							},
							items: []
						},
						{
							xtype: 'panel',
							region: 'west',
							collapsible: true,
							flex: 1,
							//margin: '0 10 0 0',
							items: [
								{
									xtype:'workflowObjectSelectionGrid',
									title:this.T('objects'),
									ref:'objectsGrid',
									params: {mode:'search'},
									height:150,
									enableAttachments: false
								}
							]
						},
						/*{
							xtype: 'workflowTransactionPropertiesPanel',
							region: 'east',
							margin: '0 10 0 0',
							//width:400,
							flex: 1,
							ref: 'propertiesGrid'
						}*/
						{
							xtype: 'panel',
							region: 'east',
							collapsible: true,
							title: this.T('attributes'),
							flex: 1,
							ref: 'propertiesPanel',
							items: [
								/*{
									xtype: 'textfield',
									fieldLabel: 'MyLabel'
								}*/
							]
						}
					],
					bbar: [
						'->',
						{
							xtype:'button',
							iconCls: 'icon-search',
							text:this.T("search"),
							action:'searchTransaction'
						},
						'->'
					]
				}
			]
		});

		this.callParent(arguments);
	}
});