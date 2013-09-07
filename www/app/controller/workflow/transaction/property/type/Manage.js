Ext.define('Aenis.controller.workflow.transaction.property.type.Manage', {
	extend: 'Ext.app.Controller',
	
	requires: [
        'Aenis.view.workflow.transaction.property.type.Manage'
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
                '[ref=typesGrid]': {
                    selectionchange: this.onSelectionChangeTypesGrid,
                    beforerender: this.onBeforeRenderTypesGrid
                },

                '[ref=typesCombo]': {
                    change: this.onChangeTypesCombo
                },
                '[action=addTypeValueAction]': {
                    click: this.onAddTypeValueAction
                },
                '[ref=typeValuesGrid]': {
                    edit: this.editTypeValuesGrid,
                    selectionchange: this.onSelectionTypeValuesGrid
                },
                '[ref=deleteTypeValueAction]': {
                    click: this.onDeleteTypeValueAction
                },

                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onChangeTypesCombo: function(combo, newValue) {
        if(newValue=='enum')
        {
            this.getTypeValuesGrid().show();
        }
        else
        {
            this.getTypeValuesGrid().hide();
        }
    },

    onAddTypeValueAction: function() {
        var oGrid = this.getTypeValuesGrid();
        var model = Ext.create('Aenis.model.workflow.transaction.property.type.Value');
        var oForm = this.getDetailsForm().getForm();
        var oRecord = oForm.getRecord();
        if(oRecord)
        {
            model.set('tr_property_type_id', oRecord.getId());
        }
        oGrid.getStore().insert(0, model);
        oGrid.getPlugin('typeValuesCellEditing').startEditByPosition({
            row: 0,
            column: 0
        });
    },

    onSelectionTypeValuesGrid: function(model, selected) {
        if(selected.length>0)
        {
            this.getDeleteTypeValueAction().enable();
        }
        else
        {
            this.getDeleteTypeValueAction().disable();
        }
    },

    editTypeValuesGrid: function(editor, e) {
        e.grid.getStore().sync();
    },

    onDeleteTypeValueAction: function() {
        var oGrid = this.getTypeValuesGrid();
        var selection = oGrid.getSelectionModel();
        if(selection.hasSelection())
        {
            oGrid.getStore().suspendAutoSync();
            oGrid.getStore().remove(selection.getSelection());
            oGrid.getStore().resumeAutoSync();
            oGrid.getStore().sync();
        }
    },


    onAfterRenderMainView: function(oView) {
        oView.showConditionalElements();
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

    getFormValues: function(oForm) {
        var values = oForm.getValues();
        values.typeValuesData = [];
        if('enum' == values.type)
        {
            values.typeValuesData = this.getTypeValuesGrid().getStore().getRecords([]);
        }
        return values;
    },

    onclickAddBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
            this.getTypesGrid().getStore().add(this.getFormValues(oForm));
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
            oForm.getRecord().set(this.getFormValues(oForm));
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getTypesGrid();
        var selection = oGrid.getSelectionModel();
        if(selection.hasSelection())
        {
            oGrid.getStore().remove(selection.getSelection());
        }
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        var oGrid = this.getTypeValuesGrid();
        oGrid.reconfigure(oGrid.defaultStore);
        oGrid.freeStore();
        this.getTypesGrid().getSelectionModel().deselectAll();
    },

    onSelectionChangeTypesGrid: function(model, selected) {
        if(selected.length > 0)
        {
            var oGrid = this.getTypeValuesGrid();
            var store = selected[0].typeValues();
            oGrid.reconfigure(store);
            if(!store.isLoaded())
            {
                store.getProxy().on('exception', this.storeProxyExceptionHandler, store);
                store.load();
            }
            var oForm = this.getDetailsForm().getForm();
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
