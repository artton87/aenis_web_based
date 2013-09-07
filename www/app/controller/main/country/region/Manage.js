Ext.define('Aenis.controller.main.country.region.Manage', {
	extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.country.region.Manage'
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
                    click: {fn: this.onclickDeleteBtn, buffer:BestSoft.eventDelay}
                },
                '[ref=regionsGrid]': {
                    selectionchange: this.onSelectionChangeRegionsGrid
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
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
        this.getRegionsGrid().getStore().reload();
        this.onclickResetBtn();
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
            this.submitModel('create');
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
            this.submitModel('update');
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getRegionsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
            this.submitModel('destroy', {
                id: selection[0].data.id
            });
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getRegionsGrid().getSelectionModel().deselectAll();
    },

    onAfterRenderMainView: function() {
        var oGrid = this.getRegionsGrid();
        oGrid.languagesStore.load({
            scope: this,
            callback: function(records, operation) {
                if(operation.wasSuccessful())
                {
                    this.generateContentDetailsTabs(records);
                    this.getDetailsForm().enable();
                    oGrid.enable();
                    oGrid.loadStore();
                }
            }
        });
    },

    /**
     * Create and submit a model to server
     * @param {String} mode    Either 'create', 'update' or 'destroy'
     * @param {Object} [values]     Optional. Values for the model
     */
    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.main.country.Region';
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
            for(var j=fields.length-1; j>=0; --j)
            {
                var field = fields[j];
                if(!Ext.isObject(values.contentData[field.langId]))
                    values.contentData[field.langId] = {};
                values.contentData[field.langId][field.name] = field.getValue();
            }
            Ext.create(modelName, values).save(operationConfig);
        }
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
            var viewCfg = oTabs.tabContentConfig;
            var oView = Ext.ComponentManager.create(viewCfg);
            var fields = oView.query('[name]');
            for(var j=fields.length-1; j>=0; --j)
            {
                fields[j].langId = record.get('id');
            }
            oTabs.add(cfg).add(oView);
        }
        oTabs.setActiveTab(0);
    },


    loadRecordContent: function(model) {
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

    onSelectionChangeRegionsGrid: function(model, selected) {
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
    }
});
