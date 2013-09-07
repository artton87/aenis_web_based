Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.form.FieldContainer',
    'Ext.layout.container.Border',
    'Aenis.view.main.country.components.CountriesGrid',
    'Aenis.store.main.country.Regions',
    'Aenis.store.main.Languages'
]);

Ext.define('Aenis.view.main.country.region.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainCountryRegionManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.country.region.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.MultiLanguageContentRenderer'
    ],

    initComponent: function() {
        var languagesStore = Ext.create('Aenis.store.main.Languages');

        Ext.apply(this, {
            tabConfig: {
                title: this.T("regions")
            },
            items: [
                {
                    title: this.T('manage_form_title'),
                    xtype: 'form',
                    split: true,
                    collapsible: true,
                    region: 'west',
                    width: '25%',
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
                            fieldLabel: this.T('code'),
                            name: 'code',
                            maxLength: 2,
                            vtype: 'alphanum'
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
                    ref: 'regionsGrid',
                    disabled: true,
                    title: this.T('regions'),
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
                    store: Ext.create('Aenis.store.main.country.Regions'),
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
                            filterable: true
                        },
                        {
                            text: this.T('code'),
                            dataIndex: 'code',
                            width: 60,
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
