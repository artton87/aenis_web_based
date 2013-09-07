Ext.require([
    'BestSoft.tree.Panel',
    'BestSoft.grid.Panel',
    'Ext.layout.container.Border',
    'Ext.form.Panel',
    'Ext.form.field.Checkbox',
    'Ext.form.field.Number',
    'Ext.form.FieldContainer',
    'Ext.grid.column.Boolean',
    'Ext.grid.column.Number',
	'Aenis.store.main.Languages'
]);


Ext.define('Aenis.view.workflow.object.type.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowObjectTypeManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.object.type.Manage',
        'BestSoft.mixin.Localized',
		'BestSoft.mixin.MultiLanguageContentRenderer',
        'BestSoft.mixin.ShowConditionalElements'
    ],

    initComponent: function() {
        this.itemsTreeRenderer = function(value, metaData, record) {
            if(record.get('hidden'))
                metaData.style += 'opacity:0.4;';
            return value;
        };

		var languagesStore = Ext.create('Aenis.store.main.Languages');

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
                        /*{
                            fieldLabel: this.T('label'),
                            name: 'label',
                            afterLabelTextTpl: BestSoft.required,
                            allowBlank: false
                        },*/
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
                            ref: 'parentItemField',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            fieldDefaults: {
                                labelAlign: 'top'
                            },
                            items: [
                                {
                                    name: 'parent_name',
                                    ref: 'parentItemNameField',
                                    flex: 1,
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
                            fieldLabel: this.T('code'),
                            name: 'code',
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            vtype: 'alphanum'
                        },
                        {
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelWidth: 120,
                            maxValue: 999,
                            minValue: 0,
                            fieldLabel: this.T('order_in_list'),
                            name: 'order_in_list'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: this.T('hidden'),
                            name: 'hidden',
                            inputValue: true
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
                            ref: 'addAction'
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
                    xtype: 'bstree',
                    ref: 'itemsTree',
                    flex: 1,
                    title: this.T('types'),
                    region: 'center',
                    collapsible: false,
                    autoLoadStore: false,
                    rootVisible: false,
                    useArrows: true,
                    rowLines: true,
                    animate: false,
                    store: Ext.create('Aenis.store.workflow.object.Types'),
					languagesStore: languagesStore,
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true,
							hidden: true
                        }
                    ],
                    columns: [
                        {
                            text: this.T('id'),
                            dataIndex: 'id',
                            width: 60
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
                           // xtype: 'treecolumn',
                            text: this.T('label'),
                            flex: 2,
                            hideable: false,
                            //renderer: this.itemsTreeRenderer,
							renderer: this.singleLanguageContentRenderer,
                            dataIndex: 'label'
                        },
                        {
                            text: this.T('code'),
                            flex: 1,
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            renderer: this.itemsTreeRenderer,
                            dataIndex: 'code'
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0',
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
