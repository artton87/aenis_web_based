Ext.require([
    'Ext.layout.container.Border',
    'Ext.form.FieldContainer',
    'Ext.form.Panel',
    'Ext.grid.feature.Grouping',
    'Ext.tab.*',
    'Ext.ux.TabReorderer',
    'Aenis.view.workflow.inheritance.application.components.Grid',
    'Aenis.view.workflow.transaction.components.NotariesCombo',
    'Aenis.view.workflow.template.components.Editor',
    'Aenis.view.main.contact.components.SelectionGrid',
    'Aenis.view.workflow.file.components.SelectionGrid',
    'Aenis.store.workflow.party.right.Selection'
]);

Ext.define('Aenis.view.workflow.inheritance.application.Manage', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowInheritanceApplicationManage',

    layout: {
        type: 'border'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.application.Manage',
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
                                type: 'hbox'
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
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    ref:'checkboxTestatorAddress',
                                    hidden: true,
                                    layout: {
                                        type: 'vbox',
                                        pack: 'center'
                                    },
                                    items:[
                                        {
                                            xtype: 'checkbox',
                                            boxLabel: this.T("address_check"),

                                            name: 'checkbox',
                                            inputValue: 1,
                                            margin: '5 5 5 10',
                                            ref: 'checkboxAddress',
                                            checked: true
                                        }
                                    ]
                                },
                                {
                                    xtype:'displayfield',
                                    ref:'openingNotary',
                                    margin: '0 0 0 10px',
                                    hidden:true,
                                    fieldLabel: this.T('opening_notary'),
                                    value:''
                                },
                                {
                                    xtype:'displayfield',
                                    ref:'testatorResidenceAddress',
                                    margin: '0 0 0 10px',
                                    hidden:true,
                                    fieldLabel: this.T('place_of_residence'),
                                    value:''
                                }
                            ]
                        },
                        {
                            xtype: 'form',
                            url: 'workflow/inheritance/application/add_edit.php',
                            ref: 'detailsForm',
                            messages: {
                                createSuccess: this.T("msg_create_success"),
                                updateSuccess: this.T("msg_update_success"),
                                relationship_documents_invalid: this.T("msg_relationship_documents_invalid"),
                                doc_content_empty: this.T("msg_doc_content_empty"),
                                party_subjects_empty: this.T("msg_party_subjects_empty"),
                                party_subjects_invalid: this.T("msg_party_subjects_invalid")
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
                                                    xtype: 'workflowFileSelectionGrid',
                                                    region: 'east',
                                                    split: true,
                                                    collapsible: true,
                                                    resizable: false,
                                                    width: '34%',
                                                    title: this.T('documents'),
                                                    hash: 'relationship_documents',
                                                    ref: 'relationshipDocumentsGrid'
                                                },
                                                {
                                                    ref: 'docContentEditor',
                                                    region: 'center',
                                                    flex:1,
                                                    xtype: 'workflow.template.Editor',

                                                    editorName: 'content',
                                                    propertyTypeCode: 'template_content',
                                                    submitValue: false
                                                }
                                            ]
                                        }

                                    ]
                                }
                            ],
                            bbar: [
                                '->',
                                {
                                    xtype: 'bsbtnReset',
                                    ref: 'resetAction'
                                },
                                ' ',
                                {
                                    xtype: 'bsbtnAdd',
                                    ref: 'addAction'
                                },
                                ' ',
                                {
                                    xtype: 'bsbtnSave',
                                    ref: 'saveAction',
                                    disabled: true
                                },
                                {
                                    xtype:'button',
                                    iconCls:'icon-view',
                                    text:this.T('view_complete_document'),
                                    ref:'viewCompleteAction',
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
                    title: this.T("warrants"),
                    xtype: 'workflowInheritanceApplicationsGrid',
                    border: false,
                    ref: 'warrantsGrid',
                    autoLoadStore: true,
                    height: 250,
                    tbar: [
                        {
                            xtype: 'bsbtnEdit',
                            ref: 'editAction',
                            disabled: true
                        },
                        ' ',
                        {
                            xtype:'button',
                            iconCls:'icon-view',
                            text:this.T('view'),
                            ref:'viewAction',
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
                            ref:'approveAction',
                            iconCls:'icon-ok',
                            text:this.T("approve"),
                            disabled:true
                        },
                        {
                            ref:'terminateAction',
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
