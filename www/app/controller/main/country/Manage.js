Ext.define('Aenis.controller.main.country.Manage', {
	extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.country.Manage'
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
                '[ref=countriesGrid]': {
                    selectionchange: this.onSelectionChangeCountriesGrid,
                    beforerender: this.onBeforeRenderCountriesGrid
                }
            }, null, this);
        });
    },

    onBeforeRenderCountriesGrid: function(oGrid) {
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
        if(oForm.isValid())
        {
            var oStore = this.getCountriesGrid().getStore();
            oStore.add(oForm.getValues());
        }
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
        {
            oForm.updateRecord();
        }
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getCountriesGrid();
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
        this.getCountriesGrid().getSelectionModel().deselectAll();
    },

    onSelectionChangeCountriesGrid: function(model, selected) {
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
    }
});
