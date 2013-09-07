Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.layout.container.Border'
]);

Ext.define('Aenis.view.workflow.rate.Manage', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowRateManage',

    layout: {
        type: 'border'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.rate.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.ShowConditionalElements'
    ],

	setParcelPurposeTypes: function(value){
	  var model = Ext.ComponentQuery.query('[ref=parcelPurposeTypes]')[0].getStore().getById(parseInt(value));
		if(model)
			return model.get('label');
    },

	setBuildingTypes: function(value){
		var model = Ext.ComponentQuery.query('[ref=buildingTypes]')[0].getStore().getById(parseInt(value));
		if(model)
			return model.get('label');
	},

    initComponent: function() {
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
					url: 'workflow/rate/add_edit.php',
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
                            fieldLabel: this.T('transaction_type'),
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'transactionTypeField',
                                    flex: 1,
                                    submitValue: false,
                                    readOnly: true
                                },
								{
									xtype: 'hiddenfield',
									ref: 'transactionTypeIdField',
									name:'tr_type_id'
								},
                                {
                                    xtype: 'button',
                                    tooltip: this.T("transaction_type_select_tip"),
                                    iconCls: 'icon-browse',
                                    ref: 'transactionTypeSelectAction',
                                    margin: '0 0 0 2px'
                                },
                                {
                                    xtype: 'button',
                                    tooltip: this.T("reset"),
                                    iconCls: 'icon-reset',
                                    ref: 'transactionTypeResetAction',
                                    margin: '0 0 0 2px',
                                    disabled: true
                                }
                            ]
                        },
                        {
                            xtype: 'combobox',
                            ref: 'inheritorTypes',
                            inputWidth: 180,
                            store: Ext.create('Aenis.store.workflow.subject.inheritor.Types'),
                            queryMode: 'local',
                            emptyText: this.T("inheritor_types"),
                            displayField: 'label',
							name: 'inheritor_type_id',
                            valueField: 'id',
                            editable: false,
                            forceSelection: true
                        },
                        {
                            xtype: 'combobox',
                            ref: 'parcelPurposeTypes',
                            fieldLabel: this.T('targeted_land'),
                            //allowBlank: false,
                            //afterLabelTextTpl: BestSoft.required,
                            inputWidth: 300,
                            store: Ext.create('Aenis.store.workflow.object.realty.parcel.Types'),
                            queryMode: 'local',
                            emptyText: this.T("selects"),
                            displayField: 'label',
							name: 'parcel_purpose_type_id',
                            valueField: 'id',
                            editable: false,
                            forceSelection: true
                        },
                        {
                            xtype: 'combobox',
                            ref: 'buildingTypes',
                            fieldLabel: this.T('building_intended_use'),
                            //allowBlank: false,
                            //afterLabelTextTpl: BestSoft.required,
                            inputWidth: 300,
                            store: Ext.create('Aenis.store.workflow.object.realty.building.Types'),
                            queryMode: 'local',
                            emptyText: this.T("selects"),
                            displayField: 'label',
							name: 'building_type_id',
                            valueField: 'id',
                            editable: false,
                            forceSelection: true
                        },
						{
							xtype: 'numberfield',
							ref: 'stateFeeCoefficient',
							fieldLabel: this.T('state_fee_coefficient'),
							inputWidth: 300,
							name: 'state_fee_coefficient',
							minValue: 1
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
                    store: Ext.create('Aenis.store.workflow.Rates'),
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
                            text: this.T('tr_type_label'),
                            flex: 2,
                            dataIndex: 'tr_type_label',
                            filterable: true
                        },
                        {
                            text: this.T('targeted_land'),
                            flex: 2,
                            dataIndex: 'parcel_purpose_type_id',
                            filterable: true,
                            renderer: this.setParcelPurposeTypes
                        },
						{
							text: this.T('building_intended_use'),
							flex: 2,
							dataIndex: 'building_type_id',
							filterable: true,
							renderer: this.setBuildingTypes
						},
                        {
                            text: this.T('inheritor_type_label'),
                            flex: 1,
                            dataIndex: 'inheritor_type_label'
                        },
						{
							text: this.T('state_fee_coefficient'),
							flex: 1,
							dataIndex: 'state_fee_coefficient'
						}
                    ]
                }
            ]
        });
        this.callParent(arguments);
    }
});
