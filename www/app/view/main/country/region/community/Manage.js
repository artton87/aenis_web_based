Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.form.field.Checkbox',
    'Ext.ux.grid.FiltersFeature',
    'Ext.grid.column.Boolean',
    'Ext.form.FieldContainer',
    'Ext.layout.container.Border'
]);

Ext.define('Aenis.view.main.country.region.community.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainCountryRegionCommunityManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.country.region.community.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.MultiLanguageContentRenderer'
    ],

    initComponent: function() {
        var languagesStore = Ext.create('Aenis.store.main.Languages');

        Ext.apply(this, {
            tabConfig: {
                title: this.T("communities")
            },
            items: [
                {
                    split: true,
                    collapsible: true,
                    region: 'west',
                    width: '25%',
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            title: this.T('region'),
                            bodyStyle: 'padding:4px',
                            margin: '0 0 10px 0',
                            xtype: 'panel',
                            layout: {
                                type: 'hbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'regionField',
                                    flex: 1,
                                    submitValue: false,
                                    readOnly: true
                                },
                                {
                                    xtype: 'button',
                                    text: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'regionSelectAction',
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
                            title: this.T('manage_form_title'),
                            xtype: 'form',
                            ref: 'detailsForm',
                            disabled: true,
                            minWidth: 270,
                            flex: 1,
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
                                                fieldLabel: this.T('name'),
                                                name: 'name'
                                            }
                                        ]
                                    }
                                },
                                {
                                    xtype: 'checkbox',
                                    boxLabel: this.T('is_urban'),
                                    name: 'is_urban',
                                    inputValue: true,
                                    checked: true
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
                        }
                    ]
                },
                {
                    xtype: 'bsgrid',
                    ref: 'communitiesGrid',
                    disabled: true,
                    title: this.T('communities'),
                    region: 'center',
                    collapsible: false,
                    autoLoadStore: false,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
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
                            hidden: true,
                            filterable: true
                        },
                        {
                            xtype: 'booleancolumn',
                            text: this.T('is_urban'),
                            dataIndex: 'is_urban',
                            width: 90,
                            filterable: true
                        },
                        {
                            text: this.T('name'),
                            flex: 1,
                            dataIndex: 'name',
                            langMissingText: this.T("not_filled_in"),
                            renderer: this.multiLanguageContentRenderer
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
