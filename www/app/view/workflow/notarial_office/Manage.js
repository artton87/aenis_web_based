Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.layout.container.Border',
    'Ext.form.FieldContainer',
    'Ext.grid.feature.Grouping',
    'Ext.ux.grid.FiltersFeature',
    'Aenis.store.workflow.NotarialOffices',
    'Aenis.store.main.Languages'
]);

Ext.define('Aenis.view.workflow.notarial_office.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowNotarial_officeManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.notarial_office.Manage',
        'Locale.hy_AM.workflow.notarial_office.components.Grid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.MultiLanguageContentRenderer'
    ],


    initComponent: function() {
        var languagesStore = Ext.create('Aenis.store.main.Languages');
        Ext.apply(this, {
            tabConfig: {
                title: this.T("offices")
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
                    minWidth: 370,
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
                                        fieldLabel: this.T('address'),
                                        name: 'address'
                                    }
                                ]
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: this.T('community'),
                            afterLabelTextTpl: BestSoft.required,
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'communityField',
                                    flex: 1,
                                    submitValue: false,
                                    allowBlank: false,
                                    readOnly: true
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'communitySelectAction',
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
                            fieldLabel: this.T('postal_index'),
                            labelAlign: 'right',
                            labelWidth: 200,
                            name: 'postal_index'
                        },
                        {
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelWidth: 200,
                            fieldLabel: this.T('latitude'),
                            name: 'latitude',
                            afterLabelTextTpl: BestSoft.required,
                            minValue: 38, maxValue: 42,
                            allowBlank: false,
                            decimalPrecision: 7
                        },
                        {
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelWidth: 200,
                            fieldLabel: this.T('longitude'),
                            name: 'longitude',
                            afterLabelTextTpl: BestSoft.required,
                            minValue: 43, maxValue: 47,
                            allowBlank: false,
                            decimalPrecision: 7
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
                    ref: 'officesGrid',
                    title: this.T('offices'),
                    region: 'center',
                    collapsible: false,
                    autoLoadStore: false,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        },
                        {
                            ftype:'grouping'
                        }
                    ],
                    store: Ext.create('Aenis.store.workflow.NotarialOffices'),
                    languagesStore: languagesStore,
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
                            text: this.T('region'),
                            dataIndex: 'region_title',
                            width: 100,
                            filterable: true
                        },
                        {
                            text: this.T('community'),
                            dataIndex: 'community_title',
                            width: 180,
                            filterable: true
                        },
                        {
                            text: this.T('address'),
                            flex: 1,
                            groupable: false,
                            dataIndex: 'address',
                            langMissingText: this.T("not_filled_in"),
                            renderer: this.multiLanguageContentRenderer
                        },
                        {
                            text: this.T('postal_index'),
                            dataIndex: 'postal_index',
                            width: 120,
                            filterable: true
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
