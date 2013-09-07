Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.layout.container.Border',
	'Aenis.store.main.Languages'
]);

Ext.define('Aenis.view.workflow.party.type.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowPartyTypeManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.party.type.Manage',
        'BestSoft.mixin.Localized',
		'BestSoft.mixin.MultiLanguageContentRenderer',
        'BestSoft.mixin.ShowConditionalElements'
    ],

    initComponent: function() {

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
                            fieldLabel: this.T('party_type_code'),
                            name: 'party_type_code',
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
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
                    ref: 'typesGrid',
                    title: this.T('types'),
                    region: 'center',
                    collapsible: false,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
                    store: Ext.create('Aenis.store.workflow.party.Types'),
					languagesStore: languagesStore,
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true,
							hidden: true
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
							text: this.T('label'),
							flex: 2,
							hideable: false,
							dataIndex: 'label',
							hiddenFieldDataIndex: 'hidden',
							renderer: this.singleLanguageContentRenderer
						},
                        {
                            text: this.T('party_type_code'),
                            flex: 1,
                            resourceRequiredToShow: {
                                toBeRoot: true
                            },
                            dataIndex: 'party_type_code'
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
