Ext.define('Aenis.controller.sysadmin.module.Manage', {
	extend: 'Ext.app.Controller',
	
	requires: [
        'Aenis.view.sysadmin.module.Manage',
        'Aenis.store.sysadmin.Modules'
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
                '[ref=modulesGrid]': {
                    selectionchange: this.onSelectionChangeModulesGrid,
                    beforerender: this.onBeforeRenderModulesGrid
                }
            }, null, this);
        });
    },

    onBeforeRenderModulesGrid: function(oGrid) {
        var oStore = oGrid.getStore();
        oStore.on('write', this.storeWriteHandler, this);
        oStore.getProxy().on('exception', this.storeProxyExceptionHandler, oStore);
        this.getResourcesCombo().getStore().load({params:{types:'module'}});
    },

    storeWriteHandler: function(proxy, operation) {
        if(operation.action == 'create' || operation.action == 'update')
        {
            if(operation.getRecords()[0].get('auto_sync_with_resource'))
            {
                this.getResourcesCombo().getStore().reload();
            }
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
        if(oForm.isValid())
        {
            var values = oForm.getValues();
            values.auto_sync_with_resource = this.getAutoSyncWithResourceFlag().getValue();
            this.getModulesGrid().getStore().add(values);
        }
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
        {
            oForm.getRecord().set('auto_sync_with_resource', this.getAutoSyncWithResourceFlag().getValue());
            oForm.updateRecord();
        }
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getModulesGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var oStore = oGrid.getStore();
            oStore.remove(selection);
        }
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getModulesGrid().getSelectionModel().deselectAll();
    },

    onSelectionChangeModulesGrid: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
            this.getEditAction().enable();
            this.getDeleteAction().enable();
        }
        else
        {
            this.getDeleteAction().disable();
            this.onclickResetBtn();
        }
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
    }
});
