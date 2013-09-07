Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.layout.container.Border',
    'Ext.form.field.Checkbox',
    'Ext.form.field.ComboBox',
    'Ext.grid.column.Number',
    'Aenis.store.sysadmin.Resources'
]);

Ext.define('Aenis.view.sysadmin.module.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.sysadminModuleManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.sysadmin.module.Manage',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {

        this.moduleTreeRenderer = function(value, metaData, record) {
            if(!record.get('is_enabled'))
                metaData.style += 'opacity:0.4;';
            return value;
        };

        Ext.apply(this, {
            tabConfig: {
                title: this.T("modules")
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
                            fieldLabel: this.T('title'),
                            name: 'title',
                            allowBlank: false
                        },
                        {
                            fieldLabel: this.T('description'),
                            name: 'description',
                            allowBlank: false
                        },
                        {
                            fieldLabel: this.T('module'),
                            name: 'module',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelWidth: 170,
                            maxValue: 255,
                            minValue: 0,
                            fieldLabel: this.T('app_order'),
                            name: 'app_order'
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
                            boxLabel: this.T('auto_sync_with_resource'),
                            name: 'auto_sync_with_resource',
                            ref: 'autoSyncWithResourceFlag',
                            inputValue: true,
                            checked: false
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: this.T('resource'),
                            emptyText: this.T('selects'),
                            name: 'resource_id',
                            ref: 'resourcesCombo',
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
                    ref: 'modulesGrid',
                    title: this.T('modules'),
                    region: 'center',
                    collapsible: false,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
                    store: Ext.create('Aenis.store.sysadmin.Modules'),
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
                            filterable: true
                        },
                        {
                            text: this.T('title'),
                            flex: 1,
                            hideable: false,
                            dataIndex: 'title',
                            renderer: this.moduleTreeRenderer,
                            filterable: true
                        },
                        {
                            text: this.T('description'),
                            flex: 1,
                            dataIndex: 'description',
                            renderer: this.moduleTreeRenderer,
                            filterable: true
                        },
                        {
                            text: this.T('module'),
                            dataIndex: 'module',
                            renderer: this.moduleTreeRenderer,
                            filterable: true
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0',
                            width: 120,
                            text: this.T('app_order'),
                            dataIndex: 'app_order'
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
