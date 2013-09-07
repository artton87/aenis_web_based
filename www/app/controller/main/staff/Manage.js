Ext.define('Aenis.controller.main.staff.Manage', {
	extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.main.staff.Manage'
    ],
	
	 mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.staff.Manage',
        'BestSoft.mixin.Localized'
    ],


    onLaunch: function(app) {
    	app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
    		oView.control({
    			'textfield': {
                    specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
                },
                '[ref=staffTree]': {
                    beforerender: this.onBeforeRenderStaffTree,
                    selectionchange: this.onSelectionChangeStaffTree
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
                },
                '[ref=departmentSelectAction]': {
                    click: this.onclickSelectDepartmentBtn
                },
                '[ref=departmentResetAction]': {
                    click: this.onclickResetDepartmentBtn
                },
                '[ref=parentItemSelectAction]': {
                    click: this.onclickSelectParentBtn
                },
                '[ref=parentItemResetAction]': {
                    click: this.onclickResetParentBtn
                },
                '[ref=selectRoleAction]': {
                	click: this.onclickSelectRoleBtn
                },
                '[ref=deleteRoleAction]': {
                	click: this.onclickDeleteRoleBtn
                },
                '[ref=editRoleAction]': {
                	click: this.onclickEditRoleBtn
                },
                '[ref=roleGrid]': {
                    selectionchange: this.onSelectionChangeRoleGrid
                }
            }, null, this);
        });
    },

    onBeforeRenderStaffTree: function() {
    	this.getStaffTree().loadStore({params: {detailed:1}});
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
        this.onBeforeRenderStaffTree();
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
        var oTree = this.getStaffTree();
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
        var modelName = 'Aenis.model.main.Staff';
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
            values.dep_id = this.getDepartmentField().dep_id;
            values.parent_id = this.getParentItemField().parent_id;
            values.roles = this.getRoles();
            Ext.create(modelName, values).save(operationConfig);
        }
    },

    onclickResetBtn: function() {
    	this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        
        this.onclickResetParentBtn();
        this.onclickResetDepartmentBtn();
        
        this.getStaffTree().getSelectionModel().deselectAll();
        this.getRoleGrid().freeStore();        
    },


    onSelectionChangeStaffTree: function(model, selected) {
    	
    	var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
            this.getRoleGrid().reconfigure(selected[0].roles());
            
            if(selected[0].data.dep_id)
            {
            	this.getDepartmentField().setValue(selected[0].data.dep_title);
                this.getDepartmentField().dep_id = selected[0].data.dep_id;
                this.getDepartmentResetAction().enable();
            }
            else
            {
            	this.getDepartmentField().reset();
                this.getDepartmentField().dep_id = 0;
                this.getDepartmentResetAction().disable();
            }
            
            if(selected[0].data.parent_id)
            {
            	this.getParentItemField().setValue(selected[0].get('parent_title'));
                this.getParentItemField().parent_id = selected[0].get('parent_id');
                this.getParentItemResetAction().enable();
            }
            else
            {
            	this.getParentItemField().reset();
                this.getParentItemField().parent_id = 0;
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


    onclickSelectDepartmentBtn: function() {
        var oController = this.application.loadController('main.department.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                this.getDepartmentField().setValue(model.get('title'));
                this.getDepartmentField().dep_id = model.getId();
                this.getDepartmentResetAction().enable();
            },
            scope: this
        });
    },


    onclickResetDepartmentBtn: function() {
        this.getDepartmentField().reset();
        this.getDepartmentResetAction().disable();
        this.getDepartmentField().dep_id = 0;
    },
    
    onclickSelectParentBtn: function() {
        var oController = this.application.loadController('main.staff.SelectDlg');
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
    
    onclickSelectRoleBtn: function() {
    	var me = this;
        var oController = this.application.loadController('main.role.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                var store = this.getRoleGrid().getStore();
                if(store.findExact('role_id', model.getId()) != -1)
                {
                	Ext.Msg.show({title: me.application.title, msg: me.T("msg_roleAlreadyExists"), buttons: Ext.Msg.OK, icon: Ext.Msg.WARNING});
                    return false;
                }
                store.add({'role_id': model.getId(), 'title': model.get('title')});
                return true;
            },
            scope: me
        });
    },
    
    onclickDeleteRoleBtn: function() {
    	var me = this;    	
        var selectionModel = this.getRoleGrid().getSelectionModel();
        if(selectionModel.hasSelection())
        {
            Ext.Msg.confirm(this.application.title, this.T("msg_roleDelete"), function(btn) {
                if(btn == 'yes') 
                {
                	me.getRoleGrid().getStore().remove(selectionModel.getSelection()[0]);
                }
            });
        }
    },
    
    onclickEditRoleBtn: function() {
    	var selectionModel = this.getRoleGrid().getSelectionModel();
        if(selectionModel.hasSelection())
        {
            var selection = selectionModel.getLastSelected();
            var me = this;
            var oController = this.application.loadController('main.role.SelectDlg');
            oController.showDialog().on({
                itemSelected: function(model) {
                    if(me.getRoleGrid().getStore().findExact('role_id', model.getId()) != -1)
                	{
	                	Ext.Msg.show({title: me.application.title, msg: me.T("msg_roleAlreadyExists"), buttons: Ext.Msg.OK, icon: Ext.Msg.WARNING});
	                    return false;
	                }
                    selection.set('role_id', model.getId());
                    selection.set('title', model.get('title'));
                    return true;
                },
                scope: me
            });
        }
    },
    
    onSelectionChangeRoleGrid: function() {
    	var selectionModel = this.getRoleGrid().getSelectionModel();
    	if(selectionModel.hasSelection())
    	{
    		this.getDeleteRoleAction().enable();
            this.getEditRoleAction().enable();
    	}
    	else
    	{
    		this.getDeleteRoleAction().disable();
            this.getEditRoleAction().disable();
    	}
    },
    
    getRoles: function() {
        var rolesIds = [];
        var oRoleStore = this.getRoleGrid().getStore();
        oRoleStore.each(function(m) {
            rolesIds.push(m.getId());
        });
        return rolesIds;
    }
});
