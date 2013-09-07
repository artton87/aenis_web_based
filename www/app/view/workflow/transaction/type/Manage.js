Ext.require([
    'BestSoft.tree.Panel',
    'Ext.layout.container.Border',
    'Ext.layout.container.Accordion',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.form.field.Checkbox',
    'Ext.form.field.Number',
    'Ext.form.FieldContainer',
    'Ext.grid.column.Boolean',
    'Ext.grid.column.Number',
    'Aenis.store.workflow.transaction.UiTypes',
    'Aenis.store.workflow.transaction.Types',
    'Aenis.store.main.Languages',

    'BestSoft.grid.Panel',
    'Ext.selection.CellModel',
    'Ext.grid.plugin.CellEditing',
    'Aenis.store.main.YesNo',
    'Aenis.store.workflow.party.Types',
    'Aenis.store.workflow.transaction.property.Types'
]);


Ext.define('Aenis.view.workflow.transaction.type.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowTransactionTypeManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.transaction.type.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.MultiLanguageContentRenderer',
        'BestSoft.mixin.ShowConditionalElements'
    ],


    initComponent: function() {
        var languagesStore = Ext.create('Aenis.store.main.Languages'),
            partyTypesStore = Ext.create('Aenis.store.workflow.party.Types', {autoLoad: true}),
            propertyTypesStore = Ext.create('Aenis.store.workflow.transaction.property.Types', {autoLoad: true}),
            yesNoStore = Ext.create('Aenis.store.main.YesNo');

        var expandCombo = function(combo) {
            combo.expand();
        };

        Ext.apply(this, {
            tabConfig: {
                title: this.T("types")
            },
            items: [
                {
                    region: 'west',
                    width: '25%',
                    minWidth: 300,
                    layout: 'accordion',
                    split: true,
                    collapsible: true,
                    header: false,
                    items: [
                        {
                            title: '<b>'+this.T('manage_form_title')+'</b>',
                            xtype: 'form',
                            ref: 'detailsForm',
                            autoScroll: true,
                            bodyStyle: 'padding:10px 30px',
                            fieldDefaults: {
                                labelAlign: 'top',
                                anchor: '100%',
                                margin: '10px 0'
                            },
                            defaultType: 'textfield',
                            messages: {
                                createSuccess: this.T("msg_create_success"),
                                updateSuccess: this.T("msg_update_success")
                            },
                            items: [
                                {
                                    ref: 'contentDetailsTabs',
                                    xtype: 'tabpanel',
                                    enableTabScroll: true,
                                    plain: true,
                                    tabContentConfig: {
                                        xtype: 'fieldcontainer',
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch'
                                        },
                                        fieldDefaults: {
                                            labelAlign: 'top',
                                            afterLabelTextTpl: BestSoft.required,
                                            submitValue: false,
                                            margin: '2px 2px 6px 2px'
                                        },
                                        defaultType: 'textfield',
                                        items: [
                                            {
                                                fieldLabel: this.T('label'),
                                                name: 'label'
                                            }
                                        ]
                                    }
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: this.T('parent'),
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            ref: 'parentItemField',
                                            flex: 1,
                                            submitValue: false,
                                            readOnly: true
                                        },
                                        {
                                            xtype: 'button',
                                            tooltip: this.T("select"),
                                            iconCls: 'icon-browse',
                                            ref: 'parentItemSelectAction',
                                            margin: '0 0 0 2px'
                                        },
                                        {
                                            xtype: 'button',
                                            tooltip: this.T("reset"),
                                            iconCls: 'icon-reset',
                                            ref: 'parentItemResetAction',
                                            margin: '0 0 0 2px',
                                            disabled: true
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combobox',
                                    afterLabelTextTpl: BestSoft.required,
                                    fieldLabel: this.T('ui_type'),
                                    emptyText: this.T('selects'),
                                    name: 'ui_type',
                                    editable: false,
                                    allowBlank: false,
                                    queryMode: 'local',
                                    store: Ext.create('Aenis.store.workflow.transaction.UiTypes'),
                                    valueField: 'id',
                                    displayField: 'title',
                                    forceSelection: true
                                },
                                {
                                    xtype: 'numberfield',
                                    labelAlign: 'right',
                                    labelWidth: 160,
                                    fieldLabel: this.T('service_fee_coefficient_min'),
                                    name: 'service_fee_coefficient_min',
                                    minValue: 0,
                                    maxValue: 10000000.00,
                                    decimalPrecision: 2,
                                    allowDecimals: true
                                },
                                {
                                    xtype: 'numberfield',
                                    labelAlign: 'right',
                                    labelWidth: 160,
                                    fieldLabel: this.T('service_fee_coefficient_max'),
                                    name: 'service_fee_coefficient_max',
                                    minValue: 0,
                                    maxValue: 100000,
                                    decimalPrecision: 2,
                                    allowDecimals: true
                                },
                                {
                                    xtype: 'numberfield',
                                    labelAlign: 'right',
                                    labelWidth: 160,
                                    fieldLabel: this.T('form_template'),
                                    name: 'form_template',
                                    resourceRequiredToShow: {
                                        toBeRoot: true
                                    },
                                    minValue: 0,
                                    allowDecimals: false
                                },
                                {
                                    xtype: 'numberfield',
                                    labelAlign: 'right',
                                    labelWidth: 160,
                                    maxValue: 100000,
                                    minValue: 0,
                                    fieldLabel: this.T('order_in_list'),
                                    name: 'order_in_list'
                                },
                                {
                                    xtype: 'checkbox',
                                    boxLabel: this.T('is_used_in_portal'),
                                    name: 'is_used_in_portal',
                                    inputValue: true
                                },
                                {
                                    xtype: 'checkbox',
                                    boxLabel: this.T('hidden'),
                                    name: 'hidden',
                                    inputValue: true
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        pack: 'center'
                                    },
                                    defaults: {
                                        margin: 5
                                    },
                                    margin: '20 0 0 0',
                                    items: [
                                        {
                                            xtype: 'bsbtnReset'
                                        },
                                        {
                                            xtype: 'bsbtnAdd',
                                            ref: 'addAction'
                                        },
                                        {
                                            xtype: 'bsbtnSave',
                                            ref: 'editAction',
                                            disabled: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: '<b>'+this.T('party_types_title')+'</b>',
                            layout: 'fit',
                            ref: 'partyTypesPanel',
                            disabled: true,
                            items: [
                                {
                                    xtype: 'bsgrid',
                                    ref: 'partyTypesGrid',
                                    partyTypesStore: partyTypesStore,
                                    plugins: [
                                        Ext.create('Ext.grid.plugin.CellEditing', {
                                            pluginId: 'partyTypeCellEditing',
                                            clicksToEdit: 1
                                        })
                                    ],
                                    tools: [],
                                    flex: 1,
                                    border: false,
                                    enableColumnResize: false,
                                    enableColumnHide: false,
                                    sortableColumns: false,
                                    columns: [
                                        {
                                            header: this.T('party_type'),
                                            dataIndex: 'party_type_id',
                                            flex: 1,
                                            editor: {
                                                xtype: 'combobox',
                                                selectOnTab: true,
                                                queryMode: 'local',
                                                editable: false,
                                                store: partyTypesStore,
                                                valueField: 'id',
                                                displayField: 'label',
                                                lazyInit: false,
                                                lazyRender: true,
                                                forceSelection: true,
                                                listeners: {
                                                    focus: expandCombo
                                                },
                                                listClass: 'x-combo-list-small'
                                            },
                                            renderer: function(v) {
                                                var model = partyTypesStore.getById(parseInt(v));
                                                return model ? model.get('label') : '';
                                            }
                                        },
                                        {
                                            header: this.T('party_is_required'),
                                            dataIndex: 'is_required',
                                            width: 80,
                                            editor: {
                                                xtype: 'combobox',
                                                selectOnTab: true,
                                                queryMode: 'local',
                                                editable: false,
                                                store: yesNoStore,
                                                valueField: 'id',
                                                displayField: 'title',
                                                lazyInit: false,
                                                lazyRender: true,
                                                forceSelection: true,
                                                listeners: {
                                                    focus: expandCombo
                                                },
                                                listClass: 'x-combo-list-small'
                                            },
                                            renderer: function(v) {
                                                return yesNoStore.getById(v ? true : false).data.title;
                                            }
                                        },
                                        {
                                            header: this.T('party_order_in_list'),
                                            dataIndex: 'order_in_list',
                                            width: 60,
                                            editor: {
                                                xtype: 'numberfield',
                                                allowBlank: false,
                                                minValue: 0,
                                                maxValue: 255
                                            }
                                        }
                                    ],
                                    selModel: {
                                        selType: 'cellmodel'
                                    },
                                    bbar: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'icon-reload',
                                            tooltip: this.T("reset_party_type_changes"),
                                            action: 'reset_party_type'
                                        },
                                        '->',
                                        {
                                            xtype: 'bsbtnDelete',
                                            ref: 'deletePartyTypeAction',
                                            disabled: true
                                        },
                                        ' ',
                                        {
                                            xtype: 'bsbtnAdd',
                                            ref: 'addPartyTypeAction'
                                        },
                                        ' ',
                                        {
                                            xtype: 'bsbtnSave',
                                            ref: 'savePartyTypeAction',
                                            disabled: true
                                        },
                                        ' '
                                    ]
                                }
                            ]
                        },
                        {
                            title: '<b>'+this.T('property_types_title')+'</b>',
                            layout: 'fit',
                            ref: 'propertyTypesPanel',
                            disabled: true,
                            items: [
                                {
                                    xtype: 'bsgrid',
                                    ref: 'propertyTypesGrid',
                                    propertyTypesStore: propertyTypesStore,
                                    plugins: [
                                        Ext.create('Ext.grid.plugin.CellEditing', {
                                            pluginId: 'propertyTypeCellEditing',
                                            clicksToEdit: 1
                                        })
                                    ],
                                    tools: [],
                                    flex: 1,
                                    border: false,
                                    enableColumnResize: false,
                                    enableColumnHide: false,
                                    sortableColumns: false,
                                    columns: [
                                        {
                                            header: this.T('property_type'),
                                            dataIndex: 'property_type_id',
                                            flex: 1,
                                            editor: Ext.create('Ext.form.field.ComboBox', {
                                                selectOnTab: true,
                                                queryMode: 'local',
                                                editable: false,
                                                store: propertyTypesStore,
                                                valueField: 'id',
                                                displayField: 'label',
                                                lazyInit: false,
                                                lazyRender: true,
                                                forceSelection: true,
                                                listeners: {
                                                    focus: expandCombo
                                                },
                                                listClass: 'x-combo-list-small'
                                            }),
                                            renderer: function(v) {
                                                var model = propertyTypesStore.getById(parseInt(v));
                                                return model ? model.get('label') : '';
                                            }
                                        },
                                        {
                                            header: this.T('property_is_required'),
                                            dataIndex: 'is_required',
                                            width: 80,
                                            editor: Ext.create('Ext.form.field.ComboBox', {
                                                selectOnTab: true,
                                                queryMode: 'local',
                                                editable: false,
                                                store: yesNoStore,
                                                valueField: 'id',
                                                displayField: 'title',
                                                lazyInit: false,
                                                lazyRender: true,
                                                forceSelection: true,
                                                listeners: {
                                                    focus: expandCombo
                                                },
                                                listClass: 'x-combo-list-small'
                                            }),
                                            renderer: function(v) {
                                                return yesNoStore.getById(v ? true : false).data.title;
                                            }
                                        },
                                        {
                                            header: this.T('property_order_in_list'),
                                            dataIndex: 'order_in_list',
                                            width: 60,
                                            editor: {
                                                xtype: 'numberfield',
                                                allowBlank: false,
                                                minValue: 0,
                                                maxValue: 255
                                            }
                                        }
                                    ],
                                    selModel: {
                                        selType: 'cellmodel'
                                    },
                                    bbar: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'icon-reload',
                                            tooltip: this.T("reset_property_type_changes"),
                                            action: 'reset_property_type'
                                        },
                                        '->',
                                        {
                                            xtype: 'bsbtnDelete',
                                            ref: 'deletePropertyTypeAction',
                                            disabled: true
                                        },
                                        ' ',
                                        {
                                            xtype: 'bsbtnAdd',
                                            ref: 'addPropertyTypeAction'
                                        },
                                        ' ',
                                        {
                                            xtype: 'bsbtnSave',
                                            ref: 'savePropertyTypeAction',
                                            disabled: true
                                        },
                                        ' '
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'bstree',
                    ref: 'itemsTree',
                    stateId: 'workflow.transaction.Types',
                    flex: 1,
                    title: this.T('types'),
                    region: 'center',
                    collapsible: false,
                    autoLoadStore: false,
                    rootVisible: false,
                    useArrows: true,
                    rowLines: true,
                    animate: false,
                    store: Ext.create('Aenis.store.workflow.transaction.Types'),
                    languagesStore: languagesStore,
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true
                        }
                    ],
                    columns: [
                        {
                            text: this.T('id'),
                            dataIndex: 'id',
                            width: 60,
                            hidden: true
                        },
                        {
                            text: this.T('languages'),
                            minWidth: 70,
                            width: 70,
                            sortable: false,
                            hideable: false,
                            dataIndex: 'label',
                            showData: false,
                            langMissingText: this.T("not_filled_in"),
                            renderer: this.multiLanguageContentRenderer
                        },
                        {
                            xtype: 'treecolumn',
                            text: this.T('label'),
                            flex: 2,
                            hideable: false,
                            dataIndex: 'label',
                            hiddenFieldDataIndex: 'hidden',
                            renderer: this.singleLanguageContentRenderer
                        },
                        {
                            text: this.T('state_fee_coefficient'),
                            width: 150,
                            dataIndex: 'state_fee_coefficient'
                        },
                        {
                            text: this.T('form_template'),
                            width: 110,
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            dataIndex: 'form_template'
                        },
                        {
                            xtype: 'booleancolumn',
                            text: this.T('is_used_in_portal'),
                            dataIndex: 'is_used_in_portal',
                            width: 160
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0',
                            width: 120,
                            text: this.T('order_in_list'),
                            dataIndex: 'order_in_list'
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
