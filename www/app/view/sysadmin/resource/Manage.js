Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.form.field.Checkbox',
    'Ext.layout.container.Border',
    'Ext.form.field.ComboBox',
    'Ext.grid.column.Boolean',
    'Ext.grid.feature.Grouping',
    'Ext.ux.grid.FiltersFeature',
    'Aenis.store.sysadmin.resource.Types',
    'Aenis.store.sysadmin.Resources'
]);

Ext.define('Aenis.view.sysadmin.resource.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.sysadminResourceManage',
	
	layout: {
        type: 'border'
    },

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.sysadmin.resource.Manage',
        'Locale.hy_AM.sysadmin.resource.Types',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("resources")
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
                            fieldLabel: this.T('code'),
                            name: 'code',
                            allowBlank: false
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: this.T('is_root_resource'),
                            name: 'is_root_resource',
                            inputValue: true
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: this.T('type'),
                            emptyText: this.T('selects'),
                            name: 'type',
                            editable: false,
                            allowBlank: false,
                            queryMode: 'local',
                            store: Ext.create('Aenis.store.sysadmin.resource.Types'),
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
                            formBind: true,
                            ref: 'addAction'
                        },
                        ' ',
                        {
                            xtype: 'bsbtnSave',
                            disabled: true,
                            ref: 'editAction'
                        },
                        '->'
                    ]
                },
                {
                    xtype: 'bsgrid',
                    ref: 'resourcesGrid',
                    title: this.T('resources'),
                    region: 'center',
                    collapsible: false,
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
                    store: Ext.create('Aenis.store.sysadmin.Resources'),
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            disabled: true,
                            ref: 'deleteAction'
                        },
                        '->'
                    ],
                    columns: [
                        {
                            text: this.T('id'),
                            dataIndex: 'id',
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
                            groupable: false,
                            filterable: true
                        },
                        {
                            xtype: 'booleancolumn',
                            text: this.T('is_root_resource'),
                            dataIndex: 'is_root_resource',
                            width: 160
                        },
                        {
                            text: this.T('type'),
                            flex: 1,
                            dataIndex: 'type_label',
                            filterable: true
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
