Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.form.FieldContainer',
    'Ext.grid.feature.Grouping',
    'Ext.ux.grid.FiltersFeature',
    'Ext.ux.CheckColumn',
    'Ext.layout.container.Border',
    'Aenis.view.main.role.components.RolesGrid',
    'Aenis.view.sysadmin.resource.components.SelectorGrid'
]);

Ext.define('Aenis.view.main.role.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainRoleManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.role.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var roleResourcesStore = Ext.create('Aenis.store.main.role.Resources');
        Ext.apply(this, {
            tabConfig: {
                title: this.T("roles")
            },
            items: [
                {
                    split:true,
                    title: this.T('manage_form_title'),
                    xtype: 'form',
                    ref: 'detailsForm',
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    minWidth: 270,
                    autoScroll: true,
                    bodyStyle: 'padding:10px 30px',

                    messages: {
                        createSuccess: this.T("msg_create_success"),
                        updateSuccess: this.T("msg_update_success")
                    },

                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaultType: 'textfield',

                            fieldDefaults: {
                                labelAlign: 'top',
                                anchor: '100%',
                                margin: 10
                            },
                            items: [
                                {
                                    fieldLabel: this.T('title'),
                                    name: 'title',
                                    allowBlank: false,
                                    flex: 1
                                }
                            ]
                        },
                        {
                            xtype: 'sysadmin.resource.SelectorGrid',
                            ref: 'roleResourcesGrid',
                            initialStore: roleResourcesStore,
                            store: roleResourcesStore
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
                    xtype: 'mainRolesGrid',
                    ref: 'rolesGrid',
                    title: this.T('roles'),
                    region: 'east',
                    width: '40%',
                    split: true,
                    collapsible: true,
                    store: Ext.create('Aenis.store.main.Roles'),
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true
                        },
                        '->'
                    ]
                }
            ]
        });

    	this.callParent(arguments);
    }
});
