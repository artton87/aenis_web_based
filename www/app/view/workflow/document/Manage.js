Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.form.ComboBox',
    'Ext.layout.container.Border',
    'Ext.form.FieldContainer',
    'Ext.form.field.Checkbox',
	'Aenis.view.main.contact.components.SelectionGrid',
	'Aenis.view.workflow.case.components.Grid',
	'Aenis.store.main.user.Grid',
	'Aenis.view.workflow.document.components.Grid',
	'Aenis.view.workflow.document.page.Grid',
	'Aenis.store.workflow.document.page.Formats',
	'Aenis.view.workflow.transaction.components.NotariesCombo'
]);

Ext.define('Aenis.view.workflow.document.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowDocumentManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.document.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("tabTitle")
            },
            items: [
                {
					xtype: 'panel',
					region: 'north',
					title: this.T("notary_cases"),
					border: false,
					collapsible: true,
					split: true,
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'form',
							defaults: {
								margin: 5
							},
							ref: 'detailsForm',
							layout: 'vbox',
							messages: {
								createSuccess: this.T("msg_create_success"),
								updateSuccess: this.T("msg_update_success")
							},

							flex: 1,
							items: [
								{
									xtype: 'container',
									defaults: {
										margin: 5,
										labelWidth: 65,
										labelAlign: 'right'
									},
									layout: {
										type: 'hbox',
										align: 'stretch'
									},
									items: [
										{
											xtype: 'textfield',
											fieldLabel: this.T("number"),
											width: 200,
											name: 'case_code'
										},
										{
											xtype: 'combobox',
											fieldLabel: this.T('show'),
											editable: false,
											store: Ext.create('Ext.data.Store', {
												autoDestroy: true,
												fields: [
													{name: 'id', type: 'int'},
													{name: 'title', type: 'string'}
												],
												data: [
													{id: 0, title: this.T('all')},
													{id: 1, title: this.T('non_digitals')},
													{id: 2, title: this.T('digitals')}
												]
											}),
											value: 0,
											name: 'is_all_scanned',
											forceSelection: true,
											valueField: 'id',
											displayField: 'title',
											ref: 'typeCombo'
										}
									]
								},
								{
									xtype: 'container',
									border: 0,
									defaults: {
										margin: 5,
										labelAlign: 'right',
										labelWidth: 65
									},
									layout: {
										type: 'hbox'
									},
									items: [
										{
											xtype: 'combobox',
											ref: 'caseNotariesCombo',
											name: 'notary_user_id',
											margin: '5 5',
											//allowBlank: false,
											//afterLabelTextTpl: BestSoft.required,
											fieldLabel: this.T('notary'),
											labelAlign: 'right',
											labelWidth: 65,
											width: 300,
											store: Ext.create('Aenis.store.main.user.Grid'),
											queryMode: 'local',
											editable: false,
											valueField: 'id',
											displayField: 'user_full_name',
											forceSelection: true
										},
										{
											xtype: 'button',
											text: this.T("reset"),
											iconCls: 'icon-reset',
											action: 'reset'
										}
									]
								},
								{
									xtype: 'container',
									border: 0,
									defaults: {
										margin: 5,
										labelAlign: 'right',
										labelWidth: 65
									},
									items: [
										{
											xtype: 'button',
											text: this.T("search"),
											align: 'right',
											iconCls: 'icon-search',
											ref: 'searchCaseAction',
											margin: '0 0 0 77px'
										}
									]
								}

							]
						},
						{
							xtype: 'form',
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							flex: 1,
							ref: 'addCaseForm',
							disabled: true,
							items: [
								{
									xtype: 'workflowCaseGrid',
									ref: 'caseGrid',
									border: false,
									autoLoadStore: false,
									flex:1,
									tbar: [
										{
											xtype: 'button',
											text: this.T("scanned"),
											ref: 'scanned',
											iconCls: 'icon-ok',
											margin: '0 0 0 12px'
										},
										{
											xtype: 'button',
											text: this.T("not_scanned"),
											ref: 'not_scanned',
											buttonAlign: 'right',
											iconCls: 'icon-cancel',
											margin: '0 0 0 12px'
										}
									]
								},
								{
									xtype: 'panel',
									title: this.T("adding_case"),
									border: 0,
									defaults: {
										margin: 5,
										labelAlign: 'right'
									},
									layout: {
										type: 'hbox'
									},
									items: [
										{
											xtype: 'workflowTransactionNotariesCombo',
											ref: 'notariesCombo',
											allowBlank: false,
											afterLabelTextTpl: BestSoft.required,
											margin: '5 5',
											submitValue: false
										},
										{
											xtype: 'bsbtnAdd',
											ref: 'addCase'
										}
									]
								}
							]
						}
					]
				 },

				{
					xtype: 'form',
					region: 'center',
					title: this.T("adding_document"),
					autoScroll: true,
					flex: 1,
					defaults: {
						margin: 5
					},
					ref: 'addDocumentForm',
					disabled: true,
					messages: {
						createSuccess: this.T("msg_create_doc_success"),
						updateSuccess: this.T("msg_update_doc_success")
					},
					items: [
						{
							xtype: 'container',
							defaults: {
								margin: 5,
								labelAlign: 'right'
							},
							layout: {
								type: 'hbox'
							},
							items: [
								{
									xtype: 'textfield',
									ref: 'docTypeField',
									allowBlank: false,
									afterLabelTextTpl: BestSoft.required,
									fieldLabel: this.T("doctype"),
									name: 'doc_type_label',
									width: 400
								},
								{
									xtype: 'textfield',
									hidden: true,
									ref: 'docTypeFieldId',
									name: 'doc_type_id'
								},
								{
									xtype: 'button',
									text: this.T("select"),
									iconCls: 'icon-browse',
									ref: 'docTypeSelectAction'
								}
							]
						},
						{
							xtype: 'container',
							defaults: {
								margin: 5,
								labelAlign: 'right'
							},
							layout: {
								type: 'hbox'
							},
							items:[
								{
									xtype: 'textfield',
									ref: 'docDescription',
									name: 'document_description',
									fieldLabel: this.T("description"),
									width: 400
								}
							]
						},
						{
							xtype: 'container',
							defaults: {
								margin: 5,
								labelAlign: 'right'
							},
							layout: {
								type: 'hbox'
							},
							items:[
								{
									xtype: 'numberfield',
									fieldLabel: this.T("page_count"),
									name: 'page_count',
									width: 150,
									minValue: 0
								},
								{
									xtype: 'numberfield',
									fieldLabel: this.T("doc_num_in_case"),
									name: 'doc_num_in_case',
									width: 150,
									minValue: 0
								}
							]
						},
						{
							xtype: 'container',
							border: 0,
							layout: {
								type: 'hbox'
							},
							buttonAlign: 'right',
							items: [
								{
									xtype: 'button',
									text: this.T("add"),
									iconCls: 'icon-add',
									ref: 'addDocAction'
								},
								{
									xtype: 'button',
									text: this.T("save"),
									iconCls: 'icon-save',
									ref: 'saveDocAction',
									disabled: true,
									//flex: 1,
									margin: '0 0 0 12px'
								},
								{
									xtype: 'button',
									text: this.T("reset"),
									buttonAlign: 'right',
									iconCls: 'icon-reset',
									ref: 'docReset',
									margin: '0 0 0 16px'
								}
							]
						},
						{
							xtype: 'workflowDocumentGrid',
							ref: 'documentsGrid',
							flex:1,
							collapsible: false,
							bbar: [
								{
									xtype: 'button',
									ref: 'historyAction',
									text: this.T("history"),
									iconCls: 'icon-print-preview',
									disabled: true
								},
								{
									xtype: 'button',
									ref: 'viewPagesAction',
									text: this.T("view_pages"),
									iconCls: 'icon-search',
									disabled: true
								},
								{
									xtype: 'bsbtnDelete',
									ref: 'deleteDocAction',
									disabled: true
								},
								'->'
							]
						}
					]

				},
				{
					xtype: 'form',
					disabled: true,
					region: 'east',
					title: this.T("pages"),
					flex: 1,
					collapsible: true,
					split: true,
					autoScroll: true,
					url: 'workflow/document/page/add_edit.php',
					defaults: {
						margin: 5
					},
					ref: 'addPageForm',
					messages: {
						createSuccess: this.T("msg_create_page_success"),
						updateSuccess: this.T("msg_update_page_success")
					},
					items: [
						{
							xtype: 'container',
							defaults: {
								margin: 5,
								labelAlign: 'right'
							},
							layout: {
								type: 'hbox'
							},
							items:[
								{
									xtype: 'textfield',
									hidden: true,
									name: 'page_id'
								},
								{
									xtype: 'numberfield',
									fieldLabel: this.T("page_number_in_document"),
									name: 'page_number_in_document',
									width: 150,
									minValue: 0
								},
								{
									xtype: 'combobox',
									fieldLabel: this.T('page_size'),
									name: 'page_format_id',
									editable: false,
									allowBlank: false,
									afterLabelTextTpl: BestSoft.required,
									store: Ext.create('Aenis.store.workflow.document.page.Formats'),
									autoLoadStore: true,
									forceSelection: true,
									valueField: 'id',
									displayField: 'title',
									ref: 'pageSizeCombo'
								},
								{
									xtype: 'textfield',
									hidden: true,
									ref: 'pageFormatId',
									name: 'page_format_id'
								}
							]
						},
						{
							xtype: 'container',
							defaults: {
								margin: 5,
								labelAlign: 'right'
							},
							layout: {
								type: 'hbox'
							},
							items: [
								{
									xtype: 'filefield',
									name: 'page_file',
									ref:'fileUpload',
									fieldLabel: this.T('attach_file'),
									labelWidth: 100,
									labelAlign: 'right',
									margin: 5,
									allowBlank: false,
									afterLabelTextTpl: BestSoft.required,
									buttonText: this.T('select'),
									iconCls: 'icon-browse'
								},
								{
									xtype:'button',
									tooltip: this.T('view'),
									iconCls: 'icon-view',
									type:'subject',
									ref:'viewFile',
									ui: 'default-toolbar-small'
								},
								{
									xtype: 'textfield',
									name: 'file_id',
									hidden: true
								}
							]
						},
						{
							xtype: 'container',
							defaults: {
								margin: 5
							},
							layout: {
								type: 'hbox'
							},
							items: [
								{
									xtype: 'container',
									border: 0,
									layout: {
										type: 'hbox'
									},
									buttonAlign: 'right',
									items: [
										{
											xtype: 'bsbtnAdd',
											ref: 'addPageAction'
										},
										{
											xtype: 'button',
											text: this.T("save"),
											iconCls: 'icon-save',
											disabled: true,
											ref: 'savePageAction',
											margin: '0 0 0 12px'
										},
										{
											xtype: 'button',
											text: this.T("reset"),
											buttonAlign: 'right',
											iconCls: 'icon-reset',
											ref: 'pageReset',
											margin: '0 0 0 16px'
										}
									]
								}
							]
						},
						{
							xtype: 'workflowDocumentPageGrid',
							ref: 'pagesGrid',
							flex:1
						}
					]
				}
            ]
        });
    	this.callParent(arguments);
    }
});
