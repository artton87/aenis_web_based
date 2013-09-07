Ext.require([
	'BestSoft.grid.Panel',
    'BestSoft.tree.Panel',
    'Ext.layout.container.Border',
    'Ext.form.Panel',
    'Ext.form.field.Checkbox',
    'Ext.form.field.ComboBox',
    'Ext.form.FieldContainer',
    'Ext.grid.column.Boolean',
    'Ext.grid.column.Number'
]);


Ext.define('Aenis.view.main.department.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainDepartmentManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.department.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("department")
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
                            fieldLabel: this.T('notarial_office'),
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'notarialOfficeField',
                                    flex: 1,
                                    submitValue: false,
                                    readOnly: true
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'notarialOfficeSelectAction',
                                    margin: '0 0 0 2px'
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("reset"),
                                    iconCls: 'icon-reset',
                                    ref: 'notarialOfficeResetAction',
                                    margin: '0 0 0 2px',
                                    disabled: true
                                }
                            ]
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
	                        fieldLabel: this.T('dep_type'),
	                        editable: false,
	                        store: Ext.create('Aenis.store.main.department.Types'),
	                        name: 'type_id',
	                        forceSelection: true,
	                        valueField: 'id',
	                        displayField: 'title',
	                        ref: 'typeCombo'
	                    },
                        {
                            fieldLabel: this.T('title'),
                            name: 'title',
                            afterLabelTextTpl: BestSoft.required
                        },
                        {
	                        xtype: 'fieldcontainer',
	                        layout: 'hbox',
	                        defaultType: 'textfield',
	
	                        fieldDefaults: {
	                            labelAlign: 'top'
	                        },
	                        items: [
                                {
                                    flex: 1,
                                    name: 'code',
                                    fieldLabel: this.T('d_code'),
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    allowBlank: false,
                                    margins: '0 10 0 0',
                                    afterLabelTextTpl: BestSoft.required
                                },
                                {
                                    flex: 1,
                                    fieldLabel: this.T('num'),
                                    name: 'num',
                                    xtype: 'numberfield',
                                    value: 0,
                                    minValue: 0
                                }
                            ]
	                    },
	                    {
	                        xtype: 'fieldcontainer',
	                        layout: 'hbox',
	                        defaultType: 'textfield',
	
	                        fieldDefaults: {
	                            labelAlign: 'top'
	                        },
	                        items: [
                                {
                                    flex: 1,
                                    name: 'phone',
                                    fieldLabel: this.T('phone'),
                                    margins: '0 10 0 0'
                                },
                                {
                                    flex: 1,
                                    name: 'fax',
                                    fieldLabel: this.T('fax')
                                }
                            ]
	                    },
                        {
	                        fieldLabel: this.T('email'),
	                        name: 'email',
	                        vtype:'email'
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
                            ref: 'departmentTree',
                            flex: 1,
                            title: this.T('department'),
                            collapsible: false,
                            autoLoadStore: false,
                            rootVisible: false,
                            useArrows: true,
                            rowLines: true,
                            animate: false,
                            store: Ext.create('Aenis.store.main.Departments'),
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
                                    width: 50
                                },
                                {
                                    xtype: 'treecolumn',
                                    text: this.T('title'),
                                    flex: 3,
                                    dataIndex: 'title'
                                },
                                {
                                    text: this.T('notarial_office'),
                                    flex: 2,
                                    dataIndex: 'notarial_office_title'
                                },
                                {
                                    text: this.T('d_code'),
                                    width:50,
                                    sortable: true,
                                    dataIndex: 'code'
                                },
                                {
                                    text: this.T('num'),
                                    width:70,
                                    sortable: true,
                                    dataIndex: 'num'
                                },
                                {
                                    text: this.T('fax'),
                                    dataIndex: 'fax',
                                    hidden: true
                                },
                                {
                                    text: this.T('phone'),
                                    dataIndex: 'phone',
                                    hidden: true
                                },
                                {
                                    text: this.T('email'),
                                    dataIndex: 'email',
                                    hidden: true
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    },
    
    roleList: function(value){ if(value[0]) value = value[0].title + '... (' + value.length+')'; return value; }
});
