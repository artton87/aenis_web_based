Ext.define('Aenis.controller.workflow.template.Manage', {
	extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.workflow.template.Manage'
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
                '[ref=templatesGrid]': {
                    selectionchange: {fn: this.onSelectionChangeTemplatesGrid, buffer:BestSoft.eventDelay}
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onAfterRenderMainView: function(oView) {
        oView.showConditionalElements();
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
        this.getTemplatesGrid().getStore().reload();
        this.onclickResetBtn();
    },

    onclickSelectDocTypeBtn: function() {
        var oController = this.application.loadController('workflow.document.type.SelectDlg');
        oController.showDialog({mode:'final_document'}).on({
            itemSelected: function(model) {
                this.getDocTypeField().setValue(model.getTitle());
                this.getDocTypeField().docTypeId = model.getId();
                this.getDetailsForm().enable();
                this.getTemplateContentEditor().setDocumentType(model.getId());
                var oGrid = this.getTemplatesGrid();
                oGrid.enable();
                var store = model.templates();
                oGrid.reconfigure(store);
                store.group('definer_user_full_name'); //apply grouping manually in order to let the grid change
                oGrid.loadStore();
            },
            scope: this
        });
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
        var oGrid = this.getTemplatesGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
            this.submitModel('destroy', {
                id: selection[0].data.id
            });
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getTemplatesGrid().getSelectionModel().deselectAll();
    },

    /**
     * Create and submit a model to server
     * @param {String} mode    Either 'create', 'update' or 'destroy'
     * @param {Object} [values]     Optional. Values for the model
     */
    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.workflow.Template';
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
            this.getTemplateContentEditor().triggerSave();
            values = oForm.getValues();
            values.id = (mode=='create') ? 0 : oForm.getRecord().get('id');
            values.doc_type_id = this.getDocTypeField().docTypeId;
            Ext.create(modelName, values).save(operationConfig);
        }
    },


    onSelectionChangeTemplatesGrid: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            var me = this;
            if(selected[0].get('content'))
            {
                oForm.loadRecord(selected[0]);
                me.getEditAction().enable();
                me.getDeleteAction().enable();
            }
            else
            {
                selected[0].reload({params: {detailed: 1}}, function(/*record, operation, success*/) {
                    oForm.loadRecord(selected[0]);
                    me.getEditAction().enable();
                    me.getDeleteAction().enable();
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
