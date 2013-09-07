Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.ux.grid.FiltersFeature',
    'Ext.form.FieldContainer',
    'Ext.layout.container.Border',
    'Aenis.store.workflow.transaction.property.Types',
    'Ext.selection.CellModel',
    'Ext.grid.plugin.CellEditing'
]);

Ext.define('Aenis.view.workflow.transaction.property.type.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowTransactionPropertyTypeManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.transaction.property.type.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.ShowConditionalElements'
    ],


    initComponent: function() {
        var typesStore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'id', type: 'string'},
                {name: 'title', type: 'string'},
                {name: 'short_title', type: 'string'}
            ],
            proxy: {
                type: 'memory'
            },
            autoDestroy: true,
            data: [
                {id: 'string', title: this.T("type_string"), short_title: this.T("type_string_short")},
                {id: 'enum', title: this.T("type_enum"), short_title: this.T("type_enum_short")},
                {id: 'date', title: this.T("type_date"), short_title: this.T("type_date_short")},
                {id: 'number', title: this.T("type_number"), short_title: this.T("type_number_short")},
                {id: 'boolean', title: this.T("type_boolean"), short_title: this.T("type_boolean_short")}
            ]
        });

        var typeValuesStore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'id', type: 'string'},
                {name: 'tr_property_type_id', type: 'string'},
                {name: 'label', type: 'string'}
            ],
            proxy: {
                type: 'memory'
            },
            autoSync: true
        });

        var typeColumnRenderer = function(value) {
            var record = typesStore.getById(value);
            if(record)
                value = record.get('short_title');
            return value;
        };

        Ext.apply(this, {
            tabConfig: {
                title: this.T("types")
            },
            items: [
                {
                    split: true,
                    collapsible: true,
                    title: this.T('manage_form_title'),
                    xtype: 'form',
                    ref: 'detailsForm',
                    region: 'west',
                    width: '25%',
                    minWidth: 270,
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
                            fieldLabel: this.T('label'),
                            afterLabelTextTpl: BestSoft.required,
                            name: 'label',
                            allowBlank: false
                        },
                        {
                            fieldLabel: this.T('code'),
                            name: 'code',
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            vtype: 'alphanum'
                        },
                        {
                            xtype: 'combobox',
                            ref: 'typesCombo',
                            fieldLabel: this.T('type'),
                            afterLabelTextTpl: BestSoft.required,
                            emptyText: this.T('selects'),
                            name: 'type',
                            editable: false,
                            allowBlank: false,
                            queryMode: 'local',
                            store: typesStore,
                            valueField: 'id',
                            value: 'string',
                            displayField: 'title',
                            forceSelection: true
                        },
                        {
                            xtype: 'bsgrid',
                            ref: 'typeValuesGrid',
                            autoLoadStore: false,
                            plugins: [
                                Ext.create('Ext.grid.plugin.CellEditing', {
                                    pluginId: 'typeValuesCellEditing',
                                    clicksToEdit: 1
                                })
                            ],
                            height: 200,
                            header: false,
                            collapsible: true,
                            resizable: true,
                            resizeHandles: 's',
                            hidden: true,
                            bbar: [
                                {
                                    xtype: 'bsbtnAdd',
                                    action: 'addTypeValueAction'
                                },
                                '->',
                                {
                                    xtype: 'bsbtnDelete',
                                    ref: 'deleteTypeValueAction',
                                    disabled: true
                                }
                            ],
                            features: [
                                {
                                    ftype: 'filters',
                                    encode: false,
                                    local: true
                                }
                            ],
                            selModel: {
                                selType: 'cellmodel'
                            },
                            store: typeValuesStore,
                            defaultStore: typeValuesStore,
                            columns: [
                                {
                                    text: this.T('type_values'),
                                    flex: 1,
                                    dataIndex: 'label',
                                    hideable: false,
                                    resizable: false,
                                    editor: {
                                        xtype: 'textfield',
                                        margin: 0,
                                        allowBlank: false,
                                        submitValue: false,
                                        lazyRender: true
                                    },
                                    filterable: true
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
                    ref: 'typesGrid',
                    title: this.T('types'),
                    region: 'center',
                    collapsible: false,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
                    store: Ext.create('Aenis.store.workflow.transaction.property.Types', {autoDestroy: true}),
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
                            width: 70,
                            filterable: true,
                            hidden: true
                        },
                        {
                            text: this.T('label'),
                            flex: 2,
                            dataIndex: 'label',
                            filterable: true
                        },
                        {
                            text: this.T('type'),
                            flex: 1,
                            dataIndex: 'type',
                            renderer: typeColumnRenderer,
                            filterable: true
                        },
                        {
                            text: this.T('code'),
                            flex: 1,
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            dataIndex: 'code',
                            filterable: true
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
