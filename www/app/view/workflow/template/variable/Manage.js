Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.form.Label',
    'Ext.layout.container.Border',
    'Ext.ux.grid.FiltersFeature',
    'Ext.grid.feature.Grouping',
    'Ext.form.FieldContainer',
    'Ext.form.field.Hidden',
    'Ext.form.field.Checkbox',
    'Ext.form.field.HtmlEditor',
    'Ext.grid.column.Boolean',
    'Aenis.view.workflow.template.components.Editor'
]);

Ext.define('Aenis.view.workflow.template.variable.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowTemplateVariableManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.template.variable.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.ShowConditionalElements'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("tabTitle")
            },
            items: [
                {
                    split: true,
                    collapsible: true,
                    title: this.T('manage_form_title'),
                    xtype: 'form',
                    ref: 'detailsForm',
                    region: 'west',
                    width: '30%',
                    minWidth: 700,
                    autoScroll: true,
                    bodyStyle: 'padding:10px 30px',
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        margin: '8px 0'
                    },
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },

                    defaultType: 'textfield',

                    messages: {
                        createSuccess: this.T("msg_create_success"),
                        updateSuccess: this.T("msg_update_success")
                    },

                    items: [
                        {
                            fieldLabel: this.T('title'),
                            labelAlign: 'right',
                            labelWidth: 80,
                            name: 'title',
                            allowBlank: false
                        },
                        {
                            fieldLabel: this.T('code'),
                            labelAlign: 'right',
                            labelWidth: 80,
                            name: 'code',
                            vtype: 'alphanum',
                            resourceRequiredToShow: {
                                toBeRoot: true
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: this.T('doc_type'),
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'doc_type_label',
                                    ref: 'docTypeLabelField',
                                    flex: 1,
                                    readOnly: true
                                },
                                {
                                    xtype: 'hiddenfield',
                                    ref: 'docTypeIdField',
                                    name: 'doc_type_id'
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'docTypeSelectAction',
                                    margin: '0 0 0 2px'
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("reset"),
                                    iconCls: 'icon-reset',
                                    ref: 'docTypeResetAction',
                                    margin: '0 0 0 2px',
                                    disabled: true
                                }
                            ]
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: this.T('is_dynamic'),
                            name: 'is_dynamic',
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            inputValue: true,
                            checked: false
                        },
                        {
                            xtype: 'container',
                            margin: '8px 0',
                            layout: {
                                type:'vbox',
                                align:'stretch'
                            },
                            flex:1,
                            items: [
                                {
                                    xtype: 'label',
                                    text: this.T('content')
                                },
                                {
                                    xtype: 'workflow.template.Editor',
                                    ref: 'variableContentEditor',
                                    editorName: 'content',
                                    hideSelectTemplateButton: true,
                                    previewMode: true,
                                    flex: 1
                                }
                            ]
                        }
                    ],
                    bbar: [
                        '->',
                        {
                            xtype: 'bsbtnReset'
                        },
                        ' ',
                        {
                            xtype: 'bsbtnAdd',
                            ref: 'addAction',
                            formBind: true
                        },
                        ' ',
                        {
                            xtype: 'bsbtnSave',
                            ref: 'editAction',
                            disabled: true
                        },
                        '->'
                    ]
                },
                {
                    xtype: 'bsgrid',
                    ref: 'variablesGrid',
                    title: this.T('variables'),
                    region: 'center',
                    collapsible: false,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        },
                        {
                            ftype: 'grouping',
                            enableGroupingMenu: false,
                            groupHeaderTpl: Ext.create('Ext.XTemplate', [
                                "<tpl if='groupValue'>"+
                                    this.T("doc_type")+
                                    ": {[Ext.String.uncapitalize(values.children[0].get('doc_type_label'))]}" +
                                "</tpl>",
                                "<tpl if='!groupValue'>"+this.T("common_document_types")+"</tpl>"
                            ])
                        }
                    ],
                    autoLoadStore: false,
                    store: Ext.create('Aenis.store.workflow.template.Variables'),
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true
                        },
                        '->'
                    ],
                    columns: [
                        {
                            text: this.T('id'),
                            dataIndex: 'id',
                            width: 60,
                            hidden: true,
                            groupable: false,
                            filterable: true
                        },
                        {
                            text: this.T('title'),
                            flex: 1,
                            dataIndex: 'title',
                            groupable: false,
                            filterable: true
                        },
                        {
                            text: this.T('code'),
                            flex: 1,
                            dataIndex: 'code',
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            groupable: false,
                            filterable: true
                        },
                        {
                            text: this.T('doc_type'),
                            flex: 2,
                            dataIndex: 'doc_type_label',
                            groupable: true,
                            filterable: true
                        },
                        {
                            xtype: 'booleancolumn',
                            text: this.T('is_dynamic_short'),
                            tooltip: this.T('is_dynamic'),
                            width: 50,
                            dataIndex: 'is_dynamic',
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            groupable: false,
                            filterable: true
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
