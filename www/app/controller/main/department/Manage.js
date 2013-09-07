Ext.define('Aenis.controller.main.department.Manage', {
	extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.main.department.Manage',
        'Aenis.store.main.Departments',
        'Aenis.store.main.department.Types'
    ],
	
	 mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.department.Manage',
        'BestSoft.mixin.Localized'
    ],


    onLaunch: function(app) {
    	app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
    		oView.control({
    			'textfield': {
                    specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
                },
                '[ref=departmentTree]': {
                    beforerender: this.onBeforeRenderDepartmentTree,
                    selectionchange: this.onSelectionChangeDepartmentTree
                },
                '[ref=typeCombo]': {
                    beforerender: this.onBeforeRenderTypeCombo
                },
                '[ref=parentItemSelectAction]': {
                    click: this.onclickSelectParentBtn
                },
                '[ref=parentItemResetAction]': {
                    click: this.onclickResetParentBtn
                },
                '[ref=notarialOfficeSelectAction]': {
                    click: this.onclickSelectNotarialOfficeBtn
                },
                '[ref=notarialOfficeResetAction]': {
                    click: this.onclickResetNotarialOfficeBtn
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
                '[action=reset]': {
                    click: this.onclickResetBtn
                }
            }, null, this);
        });
    },

    onBeforeRenderDepartmentTree: function(oTree) {
        oTree.loadStore({params:{detailed:1}});
    },

    onBeforeRenderTypeCombo: function(oCombo) {
        oCombo.getStore().load();
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
        this.getDepartmentTree().loadStore({params:{detailed:1}});
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
        var oTree = this.getDepartmentTree();
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
        var modelName = 'Aenis.model.main.Department';
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
            values.parent_id = this.getParentItemField().parent_id;
            values.notarial_office_id = this.getNotarialOfficeField().notarial_office_id;
            Ext.create(modelName, values).save(operationConfig);
        }
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        
        this.getParentItemResetAction().disable();
        this.getParentItemSelectAction().enable();
        this.getParentItemField().parent_id = 0;

        this.getNotarialOfficeResetAction().disable();
        this.getNotarialOfficeSelectAction().enable();
        this.getNotarialOfficeField().notarial_office_id = 0;
        
        this.getDepartmentTree().getSelectionModel().deselectAll();
    },


    onSelectionChangeDepartmentTree: function(model, selected) {
    	var oForm = this.getDetailsForm().getForm();
    	if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
            
            if(selected[0].data.parent_id)
            {
            	this.getParentItemField().setValue(selected[0].get('parent_title'));
                this.getParentItemField().parent_id = selected[0].get('parent_id');
                this.getParentItemResetAction().enable();

                this.getNotarialOfficeField().setValue(selected[0].get('notarial_office_title'));
                this.getNotarialOfficeField().parent_id = selected[0].get('notarial_office_id');
                this.getNotarialOfficeResetAction().enable();
            }
            else
            {
            	this.getParentItemField().reset();
                this.getParentItemField().parent_id = 0;
                this.getParentItemResetAction().disable();

                this.getNotarialOfficeField().reset();
                this.getNotarialOfficeField().notarial_office_id = 0;
                this.getNotarialOfficeResetAction().disable();
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
        var oController = this.application.loadController('main.department.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                this.getParentItemField().setValue(model.get('title'));
                this.getParentItemField().parent_id = model.getId();
                this.getParentItemResetAction().enable();                
            },
            scope: this
        });
    },

    onclickResetParentBtn: function() {
        this.getParentItemField().reset();
        this.getParentItemResetAction().disable();
        this.getParentItemField().parent_id = 0;
    },

    onclickSelectNotarialOfficeBtn: function() {
        var oController = this.application.loadController('workflow.notarial_office.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                this.getNotarialOfficeField().setValue(model.getTitle());
                this.getNotarialOfficeField().notarial_office_id = model.getId();
                this.getNotarialOfficeResetAction().enable();
            },
            scope: this
        });
    },

    onclickResetNotarialOfficeBtn: function() {
        this.getNotarialOfficeField().reset();
        this.getNotarialOfficeResetAction().disable();
        this.getNotarialOfficeField().notarial_office_id = 0;
    }
});
