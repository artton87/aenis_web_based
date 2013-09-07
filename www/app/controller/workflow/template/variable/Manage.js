Ext.define('Aenis.controller.workflow.template.variable.Manage', {
	extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.workflow.template.variable.Manage',
        'Aenis.store.workflow.template.Variables'
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
                '[ref=docTypeSelectAction]': {
                    click: this.onclickSelectDocTypeBtn
                },
                '[ref=docTypeResetAction]': {
                    click: this.onclickResetDocTypeBtn
                },
                '[ref=variableContentEditor]': {
                    beforeVariableInsert: this.onBeforeVariableInsertContentEditor
                },
                '[ref=variablesGrid]': {
                    selectionchange: this.onSelectionChangeVariablesGrid,
                    beforerender: this.onBeforeRenderVariablesGrid
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onBeforeVariableInsertContentEditor: function(editor, variableModel) {
        var oForm = this.getDetailsForm().getForm();
        var oRecord = oForm.getRecord();
        if(oRecord)
        {
            if(variableModel.getId() == oRecord.getId())
            {
                return false; //no sense to insert the variable which we are currently editing
            }
        }
        return true;
    },

    onAfterRenderMainView: function(oView) {
        oView.showConditionalElements();
    },

    onBeforeRenderVariablesGrid: function(oGrid) {
        var oStore = oGrid.getStore();
        oStore.on('write', this.storeWriteHandler, this);
        oStore.getProxy().on('exception', this.storeProxyExceptionHandler, oStore);
        oStore.load({params:{detailed:1}});
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

    onclickSelectDocTypeBtn: function() {
        var oController = this.application.loadController('workflow.document.type.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                this.getDocTypeLabelField().setValue(model.getTitle());
                this.getDocTypeIdField().setValue(model.getId());
                this.getDocTypeResetAction().enable();
            },
            scope: this
        });
    },

    onclickResetDocTypeBtn: function() {
        this.getDocTypeLabelField().reset();
        this.getDocTypeIdField().reset();
        this.getDocTypeResetAction().disable();
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
        this.getVariableContentEditor().triggerSave();
        if(oForm.isValid())
        {
            var oStore = this.getVariablesGrid().getStore();
            oStore.add(oForm.getValues());
        }
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        this.getVariableContentEditor().triggerSave();
        if(oForm.isValid())
        {
            oForm.updateRecord();
        }
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getVariablesGrid();
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
        this.getDocTypeResetAction().disable();
        this.getDocTypeLabelField().reset();
        this.getDocTypeIdField().reset();
        this.getVariablesGrid().getSelectionModel().deselectAll();
    },

    onSelectionChangeVariablesGrid: function(model, selected) {
        if(selected.length > 0)
        {
            var oForm = this.getDetailsForm().getForm();
            oForm.loadRecord(selected[0]);
            if(selected[0].get('doc_type_id'))
            {
                this.getDocTypeResetAction().enable();
            }
            else
            {
                this.getDocTypeResetAction().disable();
            }
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
