Ext.define('Aenis.controller.sysadmin.menu.Manage', {
	extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.sysadmin.menu.Manage',
        'Aenis.store.sysadmin.Modules',
        'Aenis.store.sysadmin.Resources',
        'Aenis.store.sysadmin.menu.Tree',
        'Aenis.model.sysadmin.menu.Item'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                'textfield': {
                    specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
                },
                '[ref=autoSyncWithResourceFlag]': {
                    change: this.onChangeAutoSyncWithResourceFlag
                },
                '[ref=parentItemSelectAction]': {
                    click: this.onclickSelectParentBtn
                },
                '[ref=parentItemResetAction]': {
                    click: this.onclickResetParentBtn
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
                '[ref=menuTree]': {
                    beforerender: this.onBeforeRenderMenuTree,
                    selectionchange: this.onSelectionChangeMenuTree
                },
                '[ref=modulesCombo]': {
                    select: this.onSelectModulesCombo
                },
                '[ref=previewToolbox]': {
                    commandActivated: this.onPreviewToolboxItemCommandActivated
                }
            }, null, this);
        });
    },

    onBeforeRenderMenuTree: function() {
        this.getModulesCombo().getStore().load();
        this.getResourcesCombo().getStore().load({params:{types:'menu'}});
    },

    modelSyncHandler: function(record, operation) {
        if(!operation.wasSuccessful()) return;
        if(operation.action == 'create' || operation.action == 'update')
        {
            if(record.get('auto_sync_with_resource'))
                this.getResourcesCombo().getStore().reload();
            
            Ext.Msg.show({
                title: this.application.title,
                msg: this.getDetailsForm().messages[operation.action+'Success'],
                icon: Ext.MessageBox.INFO,
                buttons: Ext.MessageBox.OK
            });
        }
        this.getPreviewToolbox().getStore().reload();
        this.getMenuTree().getStore().reload();
        this.onclickResetBtn();
    },

    onSelectModulesCombo: function(oCombo, records) {
        var moduleId = oCombo.getValue();
        if(moduleId)
        {
            this.onclickResetBtn();
            this.getDetailsForm().enable();
            this.getPreviewToolbox().load(moduleId, records[0].data.module);
            var oStore = this.getMenuTree().getStore();
            oStore.load({params: {app_id: moduleId, detailed:1}});
        }
        else
        {
            this.getDetailsForm().disable();
        }
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
        var oTree = this.getMenuTree();
        var selection = oTree.getSelectionModel().getSelection();
        if(selection.length > 0)
            this.submitModel('destroy', {
                id: selection[0].data.id
            });
    },

    /**
     * Create and submit a model to server
     * @param {String} mode    Either 'create', 'update' or 'destroy'
     * @param {Object} [values]     Optional. Values for the model
     */
    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.sysadmin.menu.Item';
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
            values.app_id = this.getModulesCombo().getValue();
            values.parent_id = this.getParentItemField().parentId;
            values.auto_sync_with_resource = this.getAutoSyncWithResourceFlag().getValue();
            Ext.create(modelName, values).save(operationConfig);
        }
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getParentItemResetAction().disable();
        this.getParentItemSelectAction().enable();
        this.getParentItemField().parentId = 0;
        this.getMenuTree().getSelectionModel().deselectAll();
    },

    onSelectionChangeMenuTree: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
            this.getResourcesCombo().setValue(selected[0].data.resource_id);
            if(selected[0].data.parent_id)
            {
                this.getParentItemField().setValue(selected[0].get('parent_title'));
                this.getParentItemField().parentId = selected[0].get('parent_id');
                this.getParentItemResetAction().enable();
            }
            else
            {
                this.getParentItemField().reset();
                this.getParentItemField().parentId = 0;
                this.getParentItemResetAction().disable();
            }
            this.getEditAction().enable();
            this.getDeleteAction().enable();
        }
        else
        {
            this.getDeleteAction().disable();
            this.onclickResetBtn();
        }
    },

    onclickSelectParentBtn: function() {
        var oCombo = this.getModulesCombo();
        var moduleId = oCombo.getValue();
        if(moduleId)
        {
            var oController = this.application.loadController('sysadmin.menu.SelectDlg');
            oController.showDialog(moduleId).on({
                itemSelected: function(model) {
                    this.getParentItemField().setValue(model.get('title'));
                    this.getParentItemField().parentId = model.getId();
                    this.getParentItemResetAction().enable();
                },
                scope: this
            });
        }
    },

    onclickResetParentBtn: function() {
        this.getParentItemField().reset();
        this.getParentItemResetAction().disable();
        this.getParentItemField().parentId = 0;
        this.getResourcesCombo().setValue(0);
    },

    onChangeAutoSyncWithResourceFlag: function(oChk, newValue) {
        if(newValue)
        {
            this.getResourcesCombo().hide();
        }
        else
        {
            this.getResourcesCombo().show();
        }
    },

    onPreviewToolboxItemCommandActivated: function(ev) {
        Ext.Msg.show({
            title: Ext.String.format('Command activated in {0}(#{1})', ev.moduleCode, ev.moduleId),
            msg: Ext.String.format('<span style="font-family: monospace">{0}</span>', ev.command),
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    }
});
