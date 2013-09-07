Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.layout.container.Border',
    'Ext.window.MessageBox',
    'Ext.toolbar.Paging',
    'Ext.form.field.Date',
    'Ext.form.field.Checkbox',
    'Ext.form.field.ComboBox',
    'Ext.form.Label',
    'Ext.form.field.ComboBox',
    'Ext.tab.*',
    'Ext.ux.TabReorderer',
    'Aenis.view.main.contact.components.SelectionGrid',
    'Aenis.view.workflow.object.components.SelectionGrid',
    'Aenis.view.workflow.template.components.Editor',
    'Aenis.view.workflow.will.components.Grid',
    'Aenis.view.workflow.transaction.components.NotariesCombo',
    'Aenis.view.workflow.file.components.SelectionGrid',
    'Aenis.view.workflow.inheritance.components.Form',
    'Aenis.view.workflow.inheritance.components.Grid',
    'Aenis.view.main.contact.components.SelectionGrid',
    'Aenis.view.workflow.transaction.components.PropertiesPanel'
]);

Ext.define('Aenis.view.workflow.inheritance.Manage', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowInheritanceManage',

    layout: {
        type: 'border'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    styleSheets: [
        'workflow/transaction/Grid.css'
    ],

    initComponent: function(){

        this.loadStyleSheets();

        Ext.apply(this, {
            tabConfig: {
                title: this.T("viewTabTitle")
            },
            items:[

                {
                    xtype:'panel',
                    region:'north',
                    split:true,
                    collapsible: true,
                    animCollapse: false,
                    header: false,
                    ref:'testatorSearchPanel',

                    layout: 'fit',
                    items:[                        {
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
                            xtype: 'fieldcontainer',
                            frame: true,
                            layout: {
                                type: 'hbox'
                            },
                            flex:1,

                            items: [
                                
                                {
                                    xtype:'fieldset',
                                    title: this.T('testatorSearch'),
                                    width: '20%',
                                    margin: 10,
                                    items:[
                                        
                                        {
                                            xtype:'workflowInheritanceForm'
                                        },
                                        {
                                            xtype: 'button',
                                            formBind: true,
                                            text:this.T("add"),
                                            ref:'createDeathInheritance',
                                            iconCls: 'icon-add',
                                            margin: '0 0 0 5px'
                                        }
                                    ]

                                },
                                
                                
                                {
                                    //hidden:true,            
                                    title: this.T("wills"),
                                    xtype:'workflowWillGrid',
                                    flex: 1,
                                    layout: 'fit'
                                },
                                {
                                    flex: 1,
                                    layout: 'fit',
                                    title: this.T("founded_inheritances"),
                                    xtype:'workflowInheritanceGrid'
                                }    

                            ]
                        }

                    ]
                },
                {
                    hidden:true,
                    xtype:'form',
                    header: false,
                    ref:'detailsForm',
                    region:'center',
                    url:'workflow/inheritance/add_edit.php',
                    flex:1,
                    loadingProgressStore: Ext.create('Ext.data.Store', {
                        fields: [
                            {type: 'string', name: 'loaded_item'}
                        ],
                        proxy: {
                            type: 'memory'
                        }
                    }),
                    messages:{
                        createSuccess: this.T("inheritance_msg_create_success"),
                        updateSuccess: this.T("inheritance_msg_update_success"),
                        party_subjects_empty: this.T("party_subjects_empty"),
                        party_subjects_invalid: this.T("party_subjects_invalid")
                    },
                    layout:{
                        type:'vbox',
                        align:'stretch'
                    },
                    autoScroll:true,

                    items:[
                        {
                            xtype:'workflowInheritanceGrid'
                        },
                        {
                            xtype:'tabpanel',
                            plugins: Ext.create('Ext.ux.TabReorderer'),
                            ref:'formTabPanel',
                            deferredRender: false,
                            enableTabScroll: true,
                            plain: true,
                            //flex:1,
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
                                        width:400
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
                                    xtype:'container',
                                    title:this.T("objects_documents"),
                                    ref: 'partiesPanelTab',
                                    layout:{
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    flex:1,
                                    items:[
                                        {
                                            xtype:'container',
                                            ref:'partiesPanel',
                                            layout:{
                                                type: 'hbox'
                                            },
                                            items:[
                                                
                                            ]
                                        },
                                        {
                                            xtype:'container',
                                            layout:{
                                                type:'hbox',
                                                pack:'end'
                                            },
                                            items:[
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
                                                    xtype: 'workflowObjectSelectionGrid',
                                                    title: this.T('objects'),
                                                    ref: 'objectsGrid',
                                                    enableToAttachments: true,
                                                    msgObjectExists: this.T("existing_object"),
                                                    resizable: false,
                                                    flex:1,
                                                    height: 150,
                                                    margin:'5 5'
                                                },
                                                {
                                                    xtype: 'workflowFileSelectionGrid',
                                                    resizable: false,
                                                    height: 150,
                                                    flex:1,
                                                    margin:'5 5',
                                                    title: this.T('documents'),
                                                    hash: 'relationship_documents',
                                                    ref: 'relationshipDocumentsGrid'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    ref: 'docContentEditor',
                                    xtype: 'workflow.template.Editor',
                                    title: this.T("application_announcement"),
                                    editorName: 'content',
                                    propertyTypeCode: 'certificate_template_content',
                                    documentType: '',
                                    flex:1,
                                    variableSubstituteFn: this.variableSubstituteFn
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
                                '->'
                            ]
                        }
                    ]

                }


            ]

        });
        this.callParent(arguments);
    }

});
