Ext.define('Aenis.controller.main.role.Manage', {
	extend: 'Ext.app.Controller',
	
	requires: [
        'Aenis.view.main.role.Manage',
        'Aenis.store.main.role.Resources',
        'Aenis.store.main.Roles'
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
                '[ref=rolesGrid]': {
                    selectionchange: this.onSelectionChangeRolesGrid,
                    beforerender: this.onBeforeRenderRolesGrid
                }
            }, null, this);
        });
    },

    onBeforeRenderRolesGrid: function(oGrid) {
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
            if(operation.action == 'create')
                this.getRoleResourcesGrid().getStore().rejectChanges();
            if(operation.action == 'update')
                this.getRoleResourcesGrid().getStore().commitChanges();
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
            values.permissions = this.getRoleResourcesGrid().getAllAllowedItemsInfo();
            this.getRolesGrid().getStore().add(values);
        }
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
        {
            var record = oForm.getRecord();
            record.set('permissions', this.getRoleResourcesGrid().getModifiedItemsInfo());
            oForm.updateRecord();
        }
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getRolesGrid();
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
        this.getRolesGrid().getSelectionModel().deselectAll();
        this.getRoleResourcesGrid().getStore().rejectChanges();
        this.getRoleResourcesGrid().reconfigure(this.getRoleResourcesGrid().initialStore);
    },

    onRoleResourcesGridLoaded: function() {
        this.getEditAction().enable();
        this.getDeleteAction().enable();
    },

    onSelectionChangeRolesGrid: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
            var oGrid = this.getRoleResourcesGrid();
            oGrid.reconfigure(selected[0].resources());
            var oStore = oGrid.getStore();
            oStore.group('type_label');
            if(oStore.getAt(0))
            {
                this.onRoleResourcesGridLoaded();
            }
            else
            {
                oStore.load({
                    scope: this, callback: this.onRoleResourcesGridLoaded
                });
            }
        }
        else
        {
            this.getDeleteAction().disable();
            this.onclickResetBtn();
        }
    }
});
