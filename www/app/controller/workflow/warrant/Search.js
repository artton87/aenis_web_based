Ext.define('Aenis.controller.workflow.warrant.Search', {
	extend: 'Ext.app.Controller',

	requires: [
		'Aenis.view.workflow.warrant.Search',
		'Aenis.model.workflow.Transaction',
		'Aenis.model.workflow.transaction.Type'
	],

	mixins: [
		'Locale.hy_AM.Common',
		'Locale.hy_AM.workflow.warrant.Search',
		'BestSoft.mixin.Localized'
	],


	onLaunch: function(app) {
		var me = this;
		app.loadMainViewTab(this, function(oView) {
			this.addComponentRefs(oView);
			oView.control({
				'[ref=partyTypesCombo]':{
					beforerender:me.onBeforeRenderPartyTypes
				},
				'[ref=selectTransactionTypeAction]': {
					click: this.onClickSelectTransactionType
				},
				'[action=addPartyTypeGrid]':{
					click: me.onclickAddActionPartyTypeGrid
				},
				'[action=searchTransaction]':{
					click: {fn: me.onClickSearchBtn, buffer:BestSoft.eventDelay}
				},
				'.': {
					afterrender: me.onAfterRenderView
				}
			}, null, this);
		});
	},

	onAfterRenderView: function(){
		var panel = this.getPropertiesPanel();
		var item;
		var me = this;
		Ext.suspendLayouts();
		/****/
		Ext.Ajax.request({
			url: 'workflow/transaction/property/type/types.json.php',
			method: 'POST',
			params: {
				init: 1,
				no_root_types: 1
			},
			callback: function(options, success, response) {
				if(Aenis.application.handleAjaxResponse(response))
				{
					response = Ext.JSON.decode(response.responseText);
					var types = response.data;
					if(response.success && types){
						for (var i=0; i<types.length; i++){
							var store = [];
							var label = types[i].label;
							var cfg;
							switch (types[i].type){
								case 'number':
									/*var cfg = {
									 xtype: 'numberfield',
									 fieldLabel: label
									 };*/
									cfg = {
										xtype: 'container',
										layout: 'hbox',
										items: [
											{
												xtype: 'numberfield',
												fieldLabel: label,
												emptyText: 'from',
												name: 'from_field_' + types[i].id
											},
											{
												xtype: 'numberfield',
												emptyText: 'to',
												name: 'to_field_' + types[i].id,
												margin: 4
											}
										]
									};
									break;
								case 'boolean':
									cfg = {
										xtype: 'fieldcontainer',
										fieldLabel: label,
										items:[
											{
												xtype:'radiogroup',
												//fieldLabel: me.T('yes'),
												vertical: true,
												columns: 1,
												items: [
													{
														boxLabel: me.T('yes'),
														name: 'bool_field_' + types[i].id,
														inputValue: 1
													},
													{
														boxLabel: me.T('no'),
														name: 'bool_field_' + types[i].id,
														inputValue: 0
													}
												]
											}
										]
									};

									break;
								case 'date':
									cfg = {
										xtype: 'container',
										layout: 'hbox',
										items: [
											{
												xtype: 'datefield',
												fieldLabel: label,
												emptyText: 'from',
												name: 'from_field_' + types[i].id
											},
											{
												xtype: 'datefield',
												emptyText: 'to',
												name: 'to_field_' + types[i].id,
												margin: 4
											}
										]
									};
									break;
								case 'enum':
									var model = Ext.create('Aenis.model.workflow.transaction.Property', {id:types[i].id});
									store = model.typeValues();

									cfg = {
										xtype: 'combo',
										name: 'enum_field_' + types[i].id,
										fieldLabel: label,
										inputWidth: 180,
										store: store,
										queryMode: 'local',
										displayField: 'label',
										valueField: 'id',
										editable: false,
										forceSelection: true,
										submitValue: false
									};
									break;
								default:
									cfg = {
										xtype: 'textfield',
										fieldLabel: label,
										name: 'field_' + types[i].id
									};
							}
							item = Ext.ComponentManager.create(cfg);
							panel.add(item);
						}
					}

				}
			}
		});
		Ext.resumeLayouts(true);

		/***/
	},

	onClickSelectTransactionType: function() {
		var oController = this.application.loadController('workflow.transaction.type.SelectDlg');
		oController.showDialog({uiType: 'warrant'}).on({
			itemSelected: function(model) {
				this.getTransactionTypeField().setValue(model.getTitle());
				this.getTransactionTypeField().transactionModel = model;
				this.initWithTransactionType(model);
			},
			scope: this
		});
	},

	/**
	 * Called when transaction type is being selected.
	 * Initializes UI parts and loads all related stores.
	 * @param {Aenis.model.workflow.transaction.Type} trTypeModel    Transaction type model
	 */
	initWithTransactionType: function(trTypeModel) {
		var transactionTypeId = trTypeModel.getId();

		//init content editor
		/*var oEditor = this.getDocContentEditor();
		 oEditor.setTransactionTypeId(transactionTypeId);
		 */
		// Enable transaction input/edit form and start loading.
		// When loading will be finished, form will enable automatically after calling setLoading(false)
		var oForm = this.getDetailsForm();
		oForm.enable();
		//oForm.setLoading(true);
		this.getPartiesTopBar().show();

		//prepare parties UI
		var partyTypesStore = trTypeModel.partyTypes();
		this.removePartyPanels();
		partyTypesStore.on('load', this.partyTypesStoreLoaded, this, {single: true});
		partyTypesStore.load();
	},


	/**
	 * Removes all party panels
	 */
	removePartyPanels: function() {
		//this.getPartiesTopBar().hide();
		this.getPartiesPanel().removeAll(true);
	},

	partyTypesStoreLoaded: function(partyTypesStore) {
		this.createPartyPanels(partyTypesStore);
		//this.getDetailsForm().loadingProgressStore.add({loaded_item: 'parties'});
	},

	/**
	 * Creates panel for each party type
	 * @param {Ext.data.Store} store    A store of Aenis.model.workflow.transaction.type.party.Type models
	 */
	createPartyPanels: function(store) {
		Ext.suspendLayouts();
		var me = this;
		store.each(function(record) {
			if(record.get('is_required'))
				me.createPartyByType(record);
		});
		var oCombo = this.getPartyTypesCombo();
		oCombo.bindStore(store);
		this.filterPartyTypesStore();
		Ext.resumeLayouts(true);
	},


	/**
	 * Creates an UI block for party input
	 * @param {Aenis.model.workflow.transaction.type.party.Type|Number} partyTypeModel    Either model or party type id
	 * @return {Aenis.view.main.contact.components.SelectionGrid}    A created component for input of party subjects
	 */
	createPartyByType: function(partyTypeModel) {
		if(Ext.isNumber(partyTypeModel))
		{
			var partyTypeId = partyTypeModel;
			partyTypeModel = this.getPartyTypesCombo().getStore().getById(parseInt(partyTypeId));
		}
		var partiesPanel = this.getPartiesPanel();
		var partyCmpCfg = Ext.clone(partiesPanel.partyComponentConfig);
		Ext.apply(partyCmpCfg, {
			title: partyTypeModel.get('party_type_label'),
			closable: partyTypeModel.get('is_required') ? false : true,
			partyTypeId: partyTypeModel.getId(),
			listeners: {
				destroy: {fn: this.filterPartyTypesStore, scope: this, single: true},
				render: {fn: this.filterPartyTypesStore, scope: this, single: true},
				validateSelection: {fn: this.onValidateContactSelection, scope: this}
			}
		});
		var partyCmp = Ext.ComponentManager.create(partyCmpCfg);
		partiesPanel.add(partyCmp);
		return partyCmp;
	},

	onValidateContactSelection: function(oGrid, mode, newRecord/*, oldRecord*/) {
		var bOk = true,
			me = this,
			partiesPanel = this.getPartiesPanel();
		partiesPanel.items.each(function(item) {
			if(item.contactExists(newRecord))
			{
				Ext.Msg.show({
					title: me.application.title,
					msg: partiesPanel.msgSubjectExists,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.WARNING
				});
				bOk = false;
				return false;
			}
			return true;
		});
		return bOk;
	},



	onclickAddActionPartyTypeGrid: function(){

		this.createPartyByType(parseInt(this.getPartyTypesCombo().getValue()));

		/*var party_type_code = this.getPartyTypesCombo().getValue();

		 var oCombo = this.getPartyTypesCombo();
		 var partyId = parseInt(oCombo.getValue());
		 if (partyId <= 0){
		 return;
		 }
		 var partyModel = oCombo.getStore().getById(partyId);

		 Ext.suspendLayouts();
		 var partiesPanel = this.getPartiesPanel();
		 var cfg = {
		 //title: this.T(partyModel.get('party_type_code')),
		 title: partyModel.get('label'),
		 xtype: 'mainContactSelectionGrid',
		 margin: '5 0',
		 partyTypeId: partyModel.get('id'),
		 party_type_label: this.T(partyModel.get('party_type_code')),
		 resizeHandles: 'w e',
		 closable: true,
		 params: {mode:'search'},
		 selectSingleRow: true,
		 width: 400,
		 enableAttachments: false,
		 height:150,
		 listeners: {
		 destroy: {fn: this.filterPartyTypesStore, scope: this, single: true},
		 render: {fn: this.filterPartyTypesStore, scope: this, single: true}
		 }
		 };
		 var item = Ext.ComponentManager.create(cfg);
		 partiesPanel.add(item);
		 Ext.resumeLayouts(true);
		 this.filterPartyTypesStore();*/
	},


	onBeforeRenderPartyTypes: function(oList){
		var oStore = oList.getStore();
		oStore.load({
				scope:this,
				callback: function(records) {
					this.getPartyTypesCombo().setValue(records[0]);
				}
			}
		);
	},

	onClickSearchBtn: function(){
		var oForm = this.getDetailsForm().getForm();
		var values = oForm.getValues();

		var panels = Ext.ComponentQuery.query("[partyTypeId]", this.getPartiesPanel());
		var oPartiesStore = this.getPartyTypesCombo().getStore();



		var data = {
			tr_type_id: this.getTransactionTypeField().transactionModel.getId(),
			parties: []
		};

		var oPanel, partyTypeModel;
		for (var i = 0; i < panels.length; i++){
			oPanel = panels[i];
			partyTypeModel = oPartiesStore.getById(parseInt(oPanel.partyTypeId));

			/*if(partyTypeModel.get('is_required') && oPanel.isEmpty())
			 {
			 Ext.Msg.alert(
			 this.application.title,
			 Ext.String.format(
			 oFormCmp.messages["party_subjects_empty"],
			 Ext.String.capitalize(partyTypeModel.get('party_type_label'))
			 )
			 );
			 return false;
			 }*/

			//if(!oPanel.isValid()) //panel is not empty, but may contain invalid records
			/*if(!oPanel.getStore().first())
			 {
			 Ext.Msg.show({
			 title: this.application.title,
			 msg: this.T("empty_party"),
			 buttons: Ext.Msg.OK,
			 icon: Ext.Msg.WARNING
			 });
			 return false;
			 }*/
			data.parties.push({
				party_type_id: oPanel.partyTypeId,
				data: oPanel.getSubjectRecords()
			});
		}

		/*
		 var me = this;
		 this.getPartyTypesCombo().getStore().each(function(record){
		 var party_type_code = record.get('party_type_code');
		 var capitalized = party_type_code.substr(0, 1).toUpperCase() + party_type_code.substr(1);
		 var functionName = 'get'+capitalized;
		 var currentRef = eval('me.' + functionName + '()');
		 data.push({
		 party_type_code : currentRef.getSubjectRecords()
		 });
		 });*/

		/*values.principals = this.getPrincipalsGrid().getSubjectRecords();
		 values.agents = this.getAgentsGrid().getSubjectRecords();*/




		data.objects = this.getObjectsGrid().getObjectRecords();
		data.properties = values;

		var oController = this.application.loadController('workflow.warrant.SearchResults');
		oController.openTab({params:Ext.JSON.encode(data)});
		return true;
	},

	/**
	 * Filters party types store by excluding items for which a party component is created
	 */
	filterPartyTypesStore: function() {
		var partiesPanel = this.getPartiesPanel(),
			oCombo = this.getPartyTypesCombo();
		if(!oCombo) return;
		var partyTypesStore = oCombo.getStore();
		partyTypesStore.filterBy(function(record) {
			var id = record.getId();
			return (partiesPanel.down('[partyTypeId='+id+']')) ? false : true;
		}, partiesPanel);

		var firstItem = partyTypesStore.first();
		if(firstItem) //if after filtering there are items remaining, select the first one
		{
			oCombo.select(firstItem);
			this.getPartiesTopBar().show();
		}
		else //if all items are filtered out, completely disable top bar with combobox
		{
			this.getPartiesTopBar().hide();
		}
	}
});