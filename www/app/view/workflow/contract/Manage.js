Ext.require([
    'Ext.layout.container.Border',
    'Ext.form.FieldContainer',
    'Ext.form.Panel',
    'Ext.tab.*',
    'Ext.ux.TabReorderer',
    'Aenis.view.workflow.contract.components.Grid',
    'Aenis.view.workflow.transaction.components.NotariesCombo',
    'Aenis.view.workflow.transaction.components.PropertiesPanel',
    'Aenis.view.workflow.template.components.Editor',
    'Aenis.view.main.contact.components.SelectionGrid',
    'Aenis.view.workflow.object.components.SelectionGrid',
    'Aenis.view.workflow.file.components.SelectionGrid'
]);

Ext.define('Aenis.view.workflow.contract.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowContractManage',

	layout: {
        type: 'border'
    },

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.contract.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("viewTabTitle")
            },
            items: [
                {
                    xtype: 'container',
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox',
                                pack: 'center'
                            },
                            margin: 4,
                            items: [
                                {
                                    xtype: 'workflowTransactionNotariesCombo',
                                    ref: 'notariesCombo'
                                },
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
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
                            xtype: 'form',
                            url: 'workflow/contract/add_edit.php',
                            ref: 'detailsForm',
                            messages: {
                                createSuccess: this.T("msg_create_success"),
                                updateSuccess: this.T("msg_update_success"),
                                objects_empty: this.T("msg_objects_empty"),
                                objects_invalid: this.T("msg_objects_invalid"),
                                relationship_documents_invalid: this.T("msg_relationship_documents_invalid"),
                                doc_content_empty: this.T("msg_doc_content_empty"),
                                party_subjects_empty: this.T("msg_party_subjects_empty"),
                                party_subjects_invalid: this.T("msg_party_subjects_invalid"),
                                required_property_missing: this.T("msg_required_property_missing"),
                                transaction_is_paid: this.T("transaction_is_paid")
                            },
                            loadingProgressStore: Ext.create('Ext.data.Store', {
                                fields: [
                                    {type: 'string', name: 'loaded_item'}
                                ],
                                proxy: {
                                    type: 'memory'
                                }
                            }),
                            header: false,
                            disabled: true,
                            flex: 1,
                            autoScroll: true,
                            layout: 'fit',
                            defaults: {
                                margin: '10px 20px'
                            },
                            items: [
                                {
                                    xtype: 'tabpanel',
                                    plugins: Ext.create('Ext.ux.TabReorderer'),
                                    enableTabScroll: true,
                                    deferredRender: false,
                                    plain: true,
                                    items:[
                                        {
                                            title: this.T("parties"),
                                            ref: 'partiesPanel',
                                            msgSubjectExists: this.T("existing_subject"),
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch',
                                                pack: 'center'
                                            },
                                            autoScroll: true,
                                            partyComponentConfig: {
                                                xtype: 'mainContactSelectionGrid',
                                                margin: '1 2',
                                                resizeHandles: 'w e',
                                                width:350
                                            },
                                            dockedItems: [
                                                {
                                                    xtype: 'toolbar',
                                                    dock: 'top',
                                                    ref: 'partiesTopBar',
                                                    hidden: true,
                                                    border: false,
                                                    items: [
                                                        '->',
                                                        {
                                                            xtype: 'combobox',
                                                            fieldLabel: this.T('party_type'),
                                                            labelAlign: 'right',
                                                            labelWidth: 90,
                                                            ref: 'partyTypesCombo',
                                                            formExcluded: true,
                                                            width: 300,
                                                            queryMode: 'local',
                                                            editable: false,
                                                            valueField: 'party_type_id',
                                                            displayField: 'party_type_label',
                                                            forceSelection: true
                                                        },
                                                        {
                                                            xtype: 'bsbtnAdd',
                                                            action: 'create_party_by_type'
                                                        },
                                                        '->'
                                                    ]
                                                }
                                            ],
                                            items: []
                                        },
                                        {
                                            xtype: 'panel',
                                            title: this.T("secondTabTitle"),
                                            layout: {
                                                type: 'border'
                                            },
                                            defaults: {
                                                margin: 1
                                            },
                                            items: [
                                                {
                                                    xtype: 'workflowTransactionPropertiesPanel',
                                                    region: 'west',
                                                    split: true,
                                                    collapsible: true,
                                                    resizable: false,
                                                    width: '30%',
                                                    flex: 1,
                                                    title: this.T('properties'),
                                                    ref: 'propertiesGrid'
                                                },
                                                {
                                                    region: 'center',
                                                    xtype: 'workflowObjectSelectionGrid',
                                                    resizable: false,
                                                    title: this.T('objects'),
                                                    ref: 'objectsGrid',
                                                    msgObjectExists: this.T("existing_object")
                                                },
                                                {
                                                    xtype: 'workflowFileSelectionGrid',
                                                    region: 'east',
                                                    split: true,
                                                    collapsible: true,
                                                    resizable: false,
                                                    width: '34%',
                                                    title: this.T('documents'),
                                                    hash: 'relationship_documents',
                                                    ref: 'relationshipDocumentsGrid'
                                                }
                                            ]
                                        },
                                        {
                                            ref: 'docContentEditor',
                                            xtype: 'workflow.template.Editor',
                                            title: this.T("thirdTabTitle"),
                                            editorName: 'content',
                                            propertyTypeCode: 'template_content'
                                        }
                                    ]
                                }
                            ],
                            bbar: [
                                '->',
                                {
                                    xtype: 'bsbtnReset',
                                    ref: 'resetContractAction'
                                },
                                ' ',
                                {
                                    xtype: 'bsbtnAdd',
                                    ref: 'addContractAction'
                                },
                                ' ',
                                {
                                    xtype: 'bsbtnSave',
                                    ref: 'saveContractAction',
                                    disabled: true
                                },
                                {
                                    xtype:'button',
                                    iconCls:'icon-view',
                                    text:this.T('view_complete_document'),
                                    ref:'viewCompleteContractAction',
                                    hidden: true
                                },
                                '->'
                            ]
                        }
                    ]
                },
                {
                    region: 'south',
                    split: true,
                    title: this.T("contracts"),
                    xtype: 'workflowContractGrid',
                    border: false,
                    ref: 'contractsGrid',
                    autoLoadStore: true,
                    height: 250,

                    tbar: [
                        {
                            xtype: 'bsbtnEdit',
                            ref: 'editContractAction',
                            disabled: true
                        },
                        ' ',
                        {
                            text: this.T("leave_edit_mode"),
                            ref: 'unlockContractAction',
                            disabled: true,
                            iconCls: 'icon-back',
                            hidden:true
                        },
                        {
                            xtype:'button',
                            iconCls:'icon-view',
                            text:this.T('view'),
                            ref:'viewContractAction',
                            disabled: true
                        },
                        {
                            xtype:'button',
                            iconCls:'icon-back',
                            text:this.T('reset_view_action'),
                            ref:'resetViewContractAction',
                            hidden: true
                        },
                        '->',
                        {
                            ref:'isPayedAction',
                            iconCls:'icon-paid',
                            text:this.T("is_paid"),
                            disabled:false
                        },
                        {
                            ref:'approveContractAction',
                            iconCls:'icon-ok',
                            text:this.T("approve"),
                            disabled:true
                        },
                        {
                            ref:'terminateContractAction',
                            iconCls:'icon-cancel',
                            text:this.T("terminate"),
                            disabled: true
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
