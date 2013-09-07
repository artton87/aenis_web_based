Ext.require([
	'BestSoft.grid.Panel',
    'BestSoft.tree.Panel',
    'Ext.layout.container.Border',
    'Ext.form.Panel',
    'Ext.form.field.Checkbox',
    'Ext.form.field.ComboBox',
    'Ext.form.FieldContainer',
    'Ext.grid.column.Boolean',
    'Ext.grid.column.Number',
    'Aenis.store.main.Staffs',
    'Aenis.store.main.role.Selection'
]);


Ext.define('Aenis.view.main.staff.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainStaffManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.staff.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
    	
        Ext.apply(this, {
            tabConfig: {
                title: this.T("staff")
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
                            xtype: 'fieldcontainer',
                            fieldLabel: this.T('dep_title'),
                            afterLabelTextTpl: BestSoft.required,
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'departmentField',
                                    flex: 1,
                                    submitValue: false,
                                    readOnly: true
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'departmentSelectAction',
                                    margin: '0 0 0 2px'
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("reset"),
                                    iconCls: 'icon-reset',
                                    ref: 'departmentResetAction',
                                    margin: '0 0 0 2px',
                                    disabled: true
                                }
                            ]
                        },
                        {
                            fieldLabel: this.T('title'),
                            name: 'title',
                            afterLabelTextTpl: BestSoft.required
                        },
                        {
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelWidth: 170,
                            maxValue: 999,
                            minValue: 0,
                            fieldLabel: this.T('label_staff_order'),
                            name: 'staff_order'
                        },
                        {
                            xtype:'bsgrid',
                            autoLoadStore:false,
                            hideHeaders:true,
                            resizable: true,
                            resizeHandles: 's e se',
                            title:this.T("roles"),
                            ref:'roleGrid',
                            flex: 1,
                            tools:[],
                            store: Ext.create('Aenis.store.main.role.Selection'),
                            height:150,
                            columns: [{
                                text: this.T("role_id"),
                                flex: 1,
                                dataIndex: 'id',
                                hidden: true
                            },{
                                flex: 1,
                                dataIndex: 'title'
                            }],
                            bbar:{
                                items:[
                                    '->',
                                    {
                                        xtype:'bsbtnEdit',
                                        text:this.T("edit"),
                                        ref: 'editRoleAction',
                                        disabled:true
                                    },
                                    {
                                        xtype:'bsbtnDelete',
                                        ref: 'deleteRoleAction',
                                        disabled:true
                                    },
                                    {
                                        text:this.T("select"),
                                        ref: 'selectRoleAction',
                                        iconCls:'icon-browse'
                                    },
                                    '->'
                                ]
                            }
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
                            xtype: 'bstree',
                            ref: 'staffTree',
                            flex: 1,
                            title: this.T('staff'),
                            collapsible: false,
                            autoLoadStore: false,
                            rootVisible: false,
                            useArrows: true,
                            rowLines: true,
                            animate: false,
                            store: Ext.create('Aenis.store.main.Staffs'),
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
                                    text: this.T('dep_title'),
                                    flex: 3,
                                    renderer: this.menuTreeRenderer,
                                    dataIndex: 'dep_title'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0',
                                    text: this.T('label_staff_order'),
                                    dataIndex: 'staff_order'
                                },
                                {
		                            text: this.T('roles'),
		                            flex: 1,
		                            dataIndex: 'roles',
		                            renderer:this.roleList
		                        }
                            ]
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    },
    
    roleList: function(value) {
        if(value.length == 1)
            value = value[0].title;
        else if(value.length > 1)
            value = value[0].title + ', ... (' + value.length+')';
        return value;
    }
});
