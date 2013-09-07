Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.layout.container.Border',
    'Ext.form.FieldContainer',
    'Ext.form.field.Checkbox',
    'Ext.grid.column.Boolean',
    'Ext.ux.grid.FiltersFeature',
    'Aenis.store.main.Languages'
]);

Ext.define('Aenis.view.main.user.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainUserManage',
	
	layout: {
        type: 'border'
    },

    styleSheets: [
        'main/user/components/Grid.css'
    ],
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.user.Manage',
        'Locale.hy_AM.main.user.components.Grid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.MultiLanguageContentRenderer',
        'BestSoft.mixin.ShowConditionalElements',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    initComponent: function() {
        this.loadStyleSheets();
		var languagesStore = Ext.create('Aenis.store.main.Languages');
        Ext.apply(this, {
            tabConfig: {
                title: this.T("users")
            },
            items: [
                {
                    split: true,
                    collapsible: true,
                    title: this.T('manage_form_title'),
                    xtype: 'form',
                    itemId: 'userDetailsForm',
                    ref: 'detailsForm',
                    region: 'west',
                    width: '25%',
                    minWidth: 370,
                    autoScroll: true,
                    bodyStyle: 'padding:10px 30px',
                    fieldDefaults: {
                        labelAlign: 'right',
                        labelWidth: 130,
                        margin: '5px 0'
                    },
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaultType: 'textfield',

                    messages: {
                        createSuccess: this.T("msg_create_success"),
                        updateSuccess: this.T("msg_update_success"),
                        cannot_auto_fill_passport_ssn: this.T("cannot_auto_fill_passport_ssn")
                    },

                    items: [
                        {
                            ref: 'contentDetailsTabs',
                            xtype: 'tabpanel',
                            enableTabScroll: true,
                            plain: true,
                            margin: '0 0 9 0',
                            tabContentConfig: {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                fieldDefaults: {
                                    labelAlign: 'right',
                                    submitValue: false,
                                    afterLabelTextTpl: BestSoft.required,
                                    margin: 5
                                },
                                defaultType: 'textfield',
                                items: [
                                    {
                                        fieldLabel: this.T('first_name'),
                                        name: 'first_name'
                                    },
                                    {
                                        fieldLabel: this.T('last_name'),
                                        name: 'last_name'
                                    },
                                    {
                                        fieldLabel: this.T('second_name'),
                                        name: 'second_name'
                                    }
                                ]
                            }
                        },
                        {
	                        fieldLabel: this.T('email'),
	                        name: 'email',
	                        vtype:'email'
	                    },
                        {
                            xtype: 'fieldcontainer',
                            afterLabelTextTpl: BestSoft.required,
                            fieldLabel: this.T('passport'),
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'userPassportField',
                                    name: 'passport',
                                    vtype: 'am_passport',
                                    width: 130,
                                    allowBlank: false
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("auto_fill_passport_ssn"),
                                    iconCls: 'icon-auto_fill',
                                    action: 'autoFillPassportSsn',
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            afterLabelTextTpl: BestSoft.required,
                            fieldLabel: this.T('ssn'),
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'userSsnField',
                                    name: 'ssn',
                                    vtype: 'am_ssn',
                                    width: 130,
                                    allowBlank: false
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("auto_fill_passport_ssn"),
                                    iconCls: 'icon-auto_fill',
                                    action: 'autoFillPassportSsn',
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
	                        fieldLabel: this.T('username'),
	                        name: 'username',
	                        allowBlank: false,
	                        afterLabelTextTpl: BestSoft.required
	                    },
                        {
                            xtype: 'fieldcontainer',
                            afterLabelTextTpl: BestSoft.required,
                            fieldLabel: this.T('password'),
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'userPasswordField',
                                    name: 'password',
                                    width: 130,
                                    allowBlank: false
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("auto_fill_password"),
                                    iconCls: 'icon-auto_fill',
                                    action: 'autoFillPassword',
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
	                        fieldLabel: this.T('fax_number'),
	                        name: 'fax_number',
                            vtype: 'phone'
	                    },
                        {
	                        fieldLabel: this.T('phone'),
	                        name: 'phone',
                            vtype: 'phone'
	                    },
                        {
	                        fieldLabel: this.T('phone_mobile'),
	                        name: 'phone_mobile',
                            vtype: 'phone'
	                    },
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'checkbox',
                                    boxLabel: this.T('is_notary'),
                                    name: 'is_notary',
                                    inputValue: true
                                },
                                {
                                    xtype: 'textfield',
                                    ref: 'notaryCodeField',
                                    afterLabelTextTpl: BestSoft.required,
                                    fieldLabel: this.T('notary_code'),
                                    labelAlign: 'right',
                                    width: 180,
                                    minLength: 3,
                                    maxLength: 3,
                                    hidden: true,
                                    name: 'notary_code'
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
                    ref: 'usersGrid',
                    title: this.T('users'),
                    region: 'center',
                    collapsible: false,
                    autoLoadStore: false,
                    tbar: {
                        resourceRequiredToShow: {
                            toBeRoot: true
                        },
                        items: [
                            '->',
                            {
                                xtype: 'button',
                                ref: 'showUsersBtn',
                                text: this.T("show_users"),
                                iconCls: 'grid-is_ws_consumer_0',
                                pressed: true,
                                toggleGroup: 'user_type',
                                listeners: {
                                    toggle: function(btn, pressed) {
                                        if(pressed)
                                            btn.up('bsgrid').loadStore({params:{is_ws_consumer:0}})
                                    }
                                }
                            },
                            ' ',
                            {
                                xtype: 'button',
                                text: this.T("show_ws_consumers"),
                                iconCls: 'grid-is_ws_consumer_1',
                                toggleGroup: 'user_type',
                                listeners: {
                                    toggle: function(btn, pressed) {
                                        if(pressed)
                                            btn.up('bsgrid').loadStore({params:{is_ws_consumer:1}})
                                    }
                                }
                            },
                            '->'
                        ]
                    },
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
                    store: Ext.create('Aenis.store.main.Users'),
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
					    	width: 50,
					    	hidden: true,
					    	sortable: true
					    },
                        {
					        text: this.T('first_name'),
					        dataIndex: 'first_name',
					        flex: 1,
					        sortable: false,
                            langMissingText: this.T("not_filled_in"),
					        renderer: this.multiLanguageContentRenderer,
					        filterable: true
					    },
                        {
					        text: this.T('last_name'),
					        dataIndex: 'last_name',
					        flex: 1,
					        sortable: false,
                            langMissingText: this.T("not_filled_in"),
					        renderer: this.multiLanguageContentRenderer,
					        filterable: true
					    },
                        {
					        text: this.T('second_name'),
					        dataIndex: 'second_name',
					        flex: 1,
					        sortable: false,
                            langMissingText: this.T("not_filled_in"),
					        renderer: this.multiLanguageContentRenderer,
					        filterable: true
					    },
                        {
					        text: this.T('username'),
					        dataIndex: 'username',
					        flex: 1,
					        sortable: false,
					        filterable: true
					    },
                        {
					        text: this.T('email'),
					        dataIndex: 'email',
					        flex: 1,
					        sortable: false,
					        filterable: true
					    },
                        {
					        text: this.T('fax_number'),
					        dataIndex: 'fax_number',
					        flex: 1,
					        sortable: false,
					        filterable: true
					    },
                        {
					        text: this.T('phone'),
					        dataIndex: 'phone',
					        flex: 1,
					        sortable: false,
					        filterable: true
					    },
                        {
					        text: this.T('phone_mobile'),
					        dataIndex: 'phone_mobile',
					        flex: 1,
					        sortable: false,
					        filterable: true
					    },
                        {
                            xtype: 'booleancolumn',
                            text: this.T('is_notary'),
                            dataIndex: 'is_notary',
                            width: 70,
                            filterable: true
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
