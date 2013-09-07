Ext.require([
    'BestSoft.tree.Panel',
    'Ext.layout.container.Border',
    'Ext.form.Panel',
    'Ext.form.field.Checkbox',
    'Ext.form.field.ComboBox',
    'Ext.form.FieldContainer',
    'Ext.grid.column.Boolean',
    'Ext.grid.column.Number',
    'Aenis.store.sysadmin.menu.Tree'
]);


Ext.define('Aenis.view.sysadmin.menu.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.sysadminMenuManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.sysadmin.menu.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;

        this.menuTreeRenderer = function(value, metaData, record) {
            if(!record.get('is_enabled'))
                metaData.style += 'opacity:0.4;';
            if(record.get('has_menu_sep'))
                metaData.style += 'text-decoration:underline;';
            return value;
        };

        Ext.apply(this, {
            tabConfig: {
                title: this.T("menuItems")
            },
            items: [
                {
                    split: true,
                    collapsible: true,
                    title: this.T('manage_form_title'),
                    xtype: 'form',
                    ref: 'detailsForm',
                    disabled: true,
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
                            fieldLabel: this.T('title'),
                            name: 'title',
                            allowBlank: false
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
                            fieldLabel: this.T('command'),
                            name: 'command'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: this.T('has_menu_sep'),
                            name: 'has_menu_sep',
                            inputValue: true,
                            checked: true
                        },
                        {
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelWidth: 170,
                            maxValue: 999,
                            minValue: 0,
                            fieldLabel: this.T('label_menu_order'),
                            name: 'menu_order'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: this.T('has_toolbar_button'),
                            name: 'has_toolbar_button',
                            inputValue: true
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: this.T('has_toolbar_sep'),
                            name: 'has_toolbar_sep',
                            inputValue: true
                        },
                        {
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelWidth: 170,
                            maxValue: 999,
                            minValue: 0,
                            fieldLabel: this.T('label_toolbar_order'),
                            name: 'toolbar_order'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: this.T('is_enabled'),
                            name: 'is_enabled',
                            inputValue: true,
                            checked: true
                        },
                        {
                            xtype: 'checkbox',
                            ref: 'autoSyncWithResourceFlag',
                            boxLabel: this.T('auto_sync_with_resource'),
                            name: 'auto_sync_with_resource',
                            inputValue: true,
                            checked: false
                        },
                        {
                            xtype: 'combobox',
                            ref: 'resourcesCombo',
                            fieldLabel: this.T('resource'),
                            emptyText: this.T('selects'),
                            name: 'resource_id',
                            queryMode: 'local',
                            store: Ext.create('Aenis.store.sysadmin.Resources'),
                            valueField: 'id',
                            displayField: 'title',
                            forceSelection: true
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
                    xtype: 'container',
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            title: me.T("toolbox-preview"),
                            style: 'margin-bottom:4px',
                            tbar: [
                                '->',
                                {
                                    xtype: 'combobox',
                                    ref: 'modulesCombo',
                                    labelAlign: 'right',
                                    fieldLabel: this.T('module'),
                                    emptyText: this.T('selects'),
                                    editable: false,
                                    name: 'module',
                                    queryMode: 'local',
                                    store: Ext.create('Aenis.store.sysadmin.Modules'),
                                    valueField: 'id',
                                    displayField: 'title',
                                    forceSelection: true,
                                    width: 400
                                },
                                '->'
                            ],
                            items: [
                                {
                                    xtype: 'sysadmin.menu.Toolbox',
                                    ref: 'previewToolbox',
                                    flex: 1,
                                    previewMode: true,
                                    showModulePicker: false
                                }
                            ]
                        },
                        {
                            xtype: 'bstree',
                            ref: 'menuTree',
                            flex: 1,
                            title: this.T('menuItems'),
                            collapsible: false,
                            autoLoadStore: false,
                            rootVisible: false,
                            useArrows: true,
                            rowLines: true,
                            animate: false,
                            store: Ext.create('Aenis.store.sysadmin.menu.Tree'),
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
                                    width: 60
                                },
                                {
                                    xtype: 'treecolumn',
                                    text: this.T('title'),
                                    flex: 2,
                                    hideable: false,
                                    renderer: this.menuTreeRenderer,
                                    dataIndex: 'title'
                                },
                                {
                                    text: this.T('command'),
                                    flex: 3,
                                    renderer: this.menuTreeRenderer,
                                    dataIndex: 'command'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    text: this.T('has_menu_sep'),
                                    dataIndex: 'has_menu_sep'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0',
                                    text: this.T('menu_order'),
                                    dataIndex: 'menu_order'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    text: this.T('has_toolbar_button'),
                                    dataIndex: 'has_toolbar_button'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0',
                                    text: this.T('toolbar_order'),
                                    dataIndex: 'toolbar_order'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    text: this.T('has_toolbar_sep'),
                                    dataIndex: 'has_toolbar_sep',
                                    width: 140
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
