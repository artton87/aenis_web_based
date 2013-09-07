Ext.define('Aenis.controller.workflow.party.type.Manage', {
	extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.party.type.Manage',
        'Aenis.store.workflow.party.Types'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                'textfield': {
                    specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
                },
                '[action=reset]': {
                    click: this.onclickResetBtn
                },
                '[ref=addAction]': {
                    click: {fn: this.onclickAddBtn, buffer:BestSoft.eventDelay}
                },
                '[ref=editAction]': {
                    click: {fn: this.onclickSaveBtn, buffer:BestSoft.eventDelay}
                },
                /*'[ref=deleteAction]': {
                    click: {fn: this.onclickDeleteBtn, buffer:BestSoft.eventDelay}
                },*/
                '[ref=typesGrid]': {
                    selectionchange: this.onSelectionChangeTypesGrid,
                    beforerender: this.onBeforeRenderTypesGrid
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onAfterRenderMainView: function(oView) {
        oView.showConditionalElements();
		var oGrid = this.getTypesGrid();
		oGrid.languagesStore.load({
			scope: this,
			callback: function(records, operation) {
				if(operation.wasSuccessful())
				{
					this.generateContentDetailsTabs(records);
					oGrid.loadStore({params:{detailed:1}});
				}
			}
		});
    },

	generateContentDetailsTabs: function(records) {
		var oTabs = this.getContentDetailsTabs();
		for(var i=0; i<records.length; ++i)
		{
			var record = records[i];
			var cfg = {
				layout: 'fit',
				iconCls: 'lang-' + record.get('code'),
				tabConfig: {
					title: record.get('title')
				}
			};
			var oView = Ext.ComponentManager.create(oTabs.tabContentConfig);
			var fields = oView.query('[name]');
			for (var j=fields.length-1; j>=0; --j)
			{
				fields[j].langId = record.get('id');
			}
			oTabs.add(cfg).add(oView);
		}
		oTabs.setActiveTab(0);
	},



    onBeforeRenderTypesGrid: function(oGrid) {
        var oStore = oGrid.getStore();
        oStore.on('write', this.storeWriteHandler, this);
        oStore.getProxy().on('exception', this.storeProxyExceptionHandler, oStore);
    },

    storeWriteHandler: function(proxy, operation) {
        if(operation.action == 'create' || operation.action == 'update')
        {
            Ext.Msg.show({
                title: this.application.title,
                msg: this.getDetailsForm().messages[operation.action+'Success'],
                icon: Ext.MessageBox.INFO,
                buttons: Ext.MessageBox.OK
            });
        }
        this.onclickResetBtn();
    },

    storeProxyExceptionHandler: function(proxy, response, operation) {
        if(!operation.wasSuccessful())
            this.rejectChanges();
    },

    onTextFieldSpecialKey: function(field, event) {
    	if(event.getKey() == event.ENTER) {
            var oForm = this.getDetailsForm().getForm();
            var oRecord = oForm.getRecord();
            if(oRecord)
    		{
    			this.onclickSaveBtn();
    		}
    		else
    		{
                this.onclickAddBtn();
    		}
    	}
    },

    onclickAddBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        /*if(oForm.isValid())
        {
            var oStore = this.getTypesGrid().getStore();
            oStore.add(oForm.getValues());
        }*/
		if(oForm.isValid())
			this.submitModel('create');
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        /*if(oForm.isValid())
        {
            oForm.updateRecord();
        }*/
		if(oForm.isValid())
			this.submitModel('update');
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getTypesGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var oStore = oGrid.getStore();
            oStore.remove(selection);
        }
		/*if(selection.length > 0)
			this.submitModel('destroy', {
				id: selection[0].data.id
			});*/
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getTypesGrid().getSelectionModel().deselectAll();
    },

    onSelectionChangeTypesGrid: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
			this.loadRecordContent(selected[0]);
            this.getEditAction().enable();
            this.getDeleteAction().enable();
        }
        else
        {
            this.getDeleteAction().disable();
            this.onclickResetBtn();
        }
    },

	/**
	 * @param {Aenis.model.workflow.Party.Type} model
	 */
	loadRecordContent: function(model) {
		//load multilingual data
		var oTabs = this.getContentDetailsTabs();
		var fields = oTabs.query('[name]');
		for(var j=fields.length-1; j>=0; --j)
		{
			var field = fields[j];
			var contentModel = model.content().getById(field.langId);
			if(contentModel)
			{
				field.setValue(contentModel.get(field.name));
			}
			else
			{
				field.reset();
			}
		}
	},

	/**
	 * Create and submit a model to server
	 * @param {String} mode    Either 'create', 'update' or 'destroy'
	 * @param {Object} [values]     Optional. Values for the model
	 */
	submitModel: function(mode, values) {
		var modelName = 'Aenis.model.workflow.party.Type';
		var operationConfig = {
			scope: this,
			callback: this.modelSyncHandler
		};
		if(mode == 'destroy')
		{
			Ext.create(modelName, values).destroy(operationConfig);
		}
		else
		{
			var oForm = this.getDetailsForm().getForm();
			values = oForm.getValues();
			values.id = (mode=='create') ? 0 : oForm.getRecord().get('id');

			values.contentData = {};
			var oTabs = this.getContentDetailsTabs();
			var fields = oTabs.query('[name]');
			for (var j=fields.length-1; j>=0; --j)
			{
				var field = fields[j];
				if(!Ext.isObject(values.contentData[field.langId]))
					values.contentData[field.langId] = {};
				values.contentData[field.langId][field.name] = field.getValue();
			}

			Ext.create(modelName, values).save(operationConfig);
		}
	},

	modelSyncHandler: function(record, operation) {
		if(!operation.wasSuccessful()) return;
		if(operation.action == 'create' || operation.action == 'update')
		{
			Ext.Msg.show({
				title: this.application.title,
				msg: this.getDetailsForm().messages[operation.action+'Success'],
				icon: Ext.MessageBox.INFO,
				buttons: Ext.MessageBox.OK
			});
		}
		this.getTypesGrid().getStore().reload();
		this.onclickResetBtn();
	}
});
