Ext.define('Aenis.controller.main.user.staff.Manage', {
	extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.main.user.staff.Manage'
    ],


    onLaunch: function(app) {
    	app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
        	oView.control({
                '[ref=staffsTree]': {
                    selectionchange: this.onSelectionChangeStaffsTree
                },
                '[ref=usersGrid]': {
                    selectionchange: this.onSelectionChangeUsersGrid
                },
                '[ref=userStaffsGrid]': {
                    selectionchange: this.onSelectionChangeUserStaffsGrid
                },
                '[ref=assignToStaffAction]': {
                    click: {fn: this.onAssignToStaffAction, buffer:BestSoft.eventDelay}
                },
                '[ref=removeFromStaffAction]': {
                    click: {fn: this.onRemoveFromStaffAction, buffer:BestSoft.eventDelay}
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onAfterRenderMainView: function() {
        var oUsersGrid = this.getUsersGrid();
        oUsersGrid.hideConditionalElements();
        this.getStaffsTree().loadStore();
    },

    tryEnableAssignToStaffAction: function() {
        var oUserSelection = this.getUsersGrid().getSelectionModel();
        var oStaffSelection = this.getStaffsTree().getSelectionModel();
        if(oUserSelection.hasSelection() && oStaffSelection.hasSelection())
        {
            this.getAssignToStaffAction().enable();
        }
    },

    onSelectionChangeUserStaffsGrid: function(model, selected) {
        if(selected.length>0 && selected[0].get('is_active'))
        {
            this.getRemoveFromStaffAction().enable();
        }
        else
        {
            this.getRemoveFromStaffAction().disable();
        }
    },

    onSelectionChangeStaffsTree: function() {
        this.getAssignToStaffAction().disable();
        var oStaffUsersGrid = this.getStaffUsersGrid();
        if(this.getStaffsTree().getSelectionModel().hasSelection())
        {
            var store = this.getStaffsTree().getSelectionModel().getLastSelected().users();
            oStaffUsersGrid.reconfigure(store);
            store.load({
                scope: this,
                callback: this.tryEnableAssignToStaffAction
            });
        }
        else
        {
            oStaffUsersGrid.reconfigure(oStaffUsersGrid.initialStore);
        }
    },

    onSelectionChangeUsersGrid: function() {
        this.getAssignToStaffAction().disable();
        var oUserStaffsGrid = this.getUserStaffsGrid();
        if(this.getUsersGrid().getSelectionModel().hasSelection())
        {
            var store = this.getUsersGrid().getSelectionModel().getLastSelected().staffs();
            oUserStaffsGrid.reconfigure(store);
            store.load({
                scope: this,
                callback: this.tryEnableAssignToStaffAction
            });
        }
        else
        {
            oUserStaffsGrid.reconfigure(oUserStaffsGrid.initialStore);
        }
    },

    onAssignToStaffAction: function() {
        var oUserSelection = this.getUsersGrid().getSelectionModel();
        var oStaffSelection = this.getStaffsTree().getSelectionModel();
        if(oUserSelection.hasSelection() && oStaffSelection.hasSelection())
        {
            var userModel = oUserSelection.getLastSelected();
            var staffModel = oStaffSelection.getLastSelected();
            Ext.create(
                'Aenis.model.main.user.Staff',
                {
                    user_id: userModel.getId(),
                    staff_id: staffModel.getId()
                }
            ).save({
                scope: this,
                callback: this.modelSyncHandler
            });
        }
    },

    onRemoveFromStaffAction: function() {
        var oUserStaffSelection = this.getUserStaffsGrid().getSelectionModel();
        if(oUserStaffSelection.hasSelection())
        {
            var model = oUserStaffSelection.getLastSelected();
            if(model.get('is_active'))
            {
                model.set('is_active', false);
                model.save({
                    scope: this,
                    callback: this.modelSyncHandler
                });
            }
        }
    },

    modelSyncHandler: function(record, operation) {
        if(!operation.wasSuccessful()) return;
        Ext.Msg.show({
            title: this.application.title,
            msg: this.getUserStaffsGrid().messages[operation.action+'Success'],
            icon: Ext.MessageBox.INFO,
            buttons: Ext.MessageBox.OK
        });

        var updatedUserId = record.get('user_id');
        var usersModel = this.getUsersGrid().getStore().getById(updatedUserId);
        usersModel.reload({params:{user_id:usersModel.getId()}});
        this.getUsersGrid().getSelectionModel().deselectAll();

        var staffSelection = this.getStaffsTree().getSelectionModel();
        if(staffSelection.hasSelection())
        {
            var updatedStaffId = record.get('staff_id');
            if(updatedStaffId == staffSelection.getLastSelected().getId())
            {
                var staffModel = this.getStaffsTree().getStore().getNodeById(updatedStaffId);
                staffModel.reload({params:{staff_id:staffModel.getId()}});
                this.getStaffsTree().getSelectionModel().deselectAll();
            }
        }
    }
});
