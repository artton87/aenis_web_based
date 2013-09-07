Ext.define('Aenis.controller.workflow.object.type.Manage', {
	extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.workflow.object.type.Manage',
        'Aenis.store.workflow.object.Types'
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
                '[ref=deleteAction]': {
                   // click: {fn: this.onclickDeleteBtn, buffer:BestSoft.eventDelay}
                },
                '[ref=parentItemSelectAction]': {
                    click: this.onclickSelectParentBtn
                },
                '[ref=parentItemResetAction]': {
                    click: this.onclickResetParentBtn
                },
                '[ref=itemsTree]': {
                    selectionchange: this.onSelectionChangeItemsTree,
                    beforerender: this.onBeforeRenderItemsTree
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onAfterRenderMainView: function(oView) {
        oView.showConditionalElements();
		var oTree = this.getItemsTree();
		oTree.mask();
		oTree.languagesStore.load({
			scope: this,
			callback: function(records, operation) {
				if(operation.wasSuccessful())
				{
					this.generateContentDetailsTabs(records);
					oTree.unmask();
					oTree.loadStore({params:{detailed:1}});
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


    onclickSelectParentBtn: function() {
        var me = this;
        var oController = this.application.loadController('workflow.object.type.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(ev) {
                this.getParentItemNameField().setValue(ev.name);
                this.getParentItemField().parentId = ev.id;
                this.getParentItemResetAction().enable();
            },
            scope: me
        });
    },

    onclickResetParentBtn: function() {
        this.getParentItemNameField().setValue("");
        this.getParentItemResetAction().disable();
        this.getParentItemField().parentId = 0;
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
        if(oForm.isValid())
        {
           /* var values = oForm.getValues();
            values.id = 0;
            values.parent_id = this.getParentItemField().parentId;
            var model = Ext.create('Aenis.model.workflow.object.Type', values);
            model.save({
                scope: this,
                callback: this.modelSyncHandler
            });*/
			this.submitModel('create');
        }
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
        {
           /* var values = oForm.getValues();
            values.id = oForm.getRecord().get('id');
            values.parent_id = this.getParentItemField().parentId;
            var model = Ext.create('Aenis.model.workflow.object.Type', values);
            model.save({
                scope: this,
                callback: this.modelSyncHandler
            });*/
			this.submitModel('update');
        }
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getParentItemResetAction().disable();
        this.getParentItemSelectAction().enable();
        this.getParentItemNameField().reset();
        this.getParentItemField().parentId = 0;
        this.getItemsTree().getSelectionModel().deselectAll();
    },

    onBeforeRenderItemsTree: function(oTree) {
        oTree.loadStore({params:{detailed:1}});
    },

    onSelectionChangeItemsTree: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
			this.loadRecordContent(selected[0]);
            if(selected[0].data.parent_id)
            {
                this.getParentItemNameField().setValue(selected[0].get('parent_label'));
                this.getParentItemField().parentId = selected[0].get('parent_id');
                this.getParentItemResetAction().enable();
            }
            else
            {
                this.getParentItemNameField().reset();
                this.getParentItemField().parentId = 0;
                this.getParentItemResetAction().disable();
            }
            this.getEditAction().enable();
            //this.getDeleteAction().enable();
        }
        else
        {
            //this.getDeleteAction().disable();
            this.onclickResetBtn();
        }
    },

	/**
	 * @param {Aenis.model.workflow.object.Type} model
	 */
	loadRecordContent: function(model) {
		//load multilingual data
		var oTabs = this.getContentDetailsTabs();
		var fields = oTabs.query('[name]');
		for (var j=fields.length-1; j>=0; --j)
		{
			var field = fields[j];
			var contentModel = model.content().getById(field.langId);
			if (contentModel)
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
	 * @param {Aenis.model.workflow.object.Type} model
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
		var modelName = 'Aenis.model.workflow.object.Type';
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
		this.getItemsTree().getStore().reload();
		this.onclickResetBtn();
	}
});
