Ext.define('Aenis.controller.main.user.Resources', {
	extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.user.Resources',
        'Aenis.store.main.user.Resources'
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
                '[action=delete]': {
                    click: {fn: this.onclickRemoveAllUserResourcesBtn, buffer:BestSoft.eventDelay}
                },
                '[action=save]': {
                    click: {fn: this.onclickSaveBtn, buffer:BestSoft.eventDelay}
                },
                '[ref=usersGrid]': {
                    selectionchange: this.onSelectionChangeUsersGrid
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

    onSelectionChangeUsersGrid: function(model, selected) {
        if(selected.length > 0)
        {
            this.getUserResourcesGrid().enable();
            var userResourcesStore = selected[0].resources();
            this.getUserResourcesGrid().reconfigure(userResourcesStore);
            userResourcesStore.load();
        }
        else
        {
            this.getUserResourcesGrid().reconfigure(this.getUserResourcesGrid().initialStore);
            this.getUserResourcesGrid().disable();
        }
    },

    modelSyncHandler: function(record, operation) {
        if(!operation.wasSuccessful()) return;
        Ext.Msg.show({
            title: this.application.title,
            msg: this.getUserResourcesGrid().messages[operation.action+'Success'],
            icon: Ext.MessageBox.INFO,
            buttons: Ext.MessageBox.OK
        });
        this.getUserResourcesGrid().getStore().reload();
    },

    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onclickSaveBtn();
        }
    },

    onclickSaveBtn: function() {
        var selection = this.getUsersGrid().getSelectionModel();
        if(selection.hasSelection())
        {
            var values = {
                user_id: selection.getLastSelected().getId(),
                permissions: this.getUserResourcesGrid().getModifiedItemsInfo()
            };
            this.submitModel('update', values);
        }
    },

    onclickRemoveAllUserResourcesBtn: function() {
        var selection = this.getUsersGrid().getSelectionModel();
        if(selection.hasSelection())
        {
            var values = {
                user_id: selection.getLastSelected().getId()
            };
            this.submitModel('destroy', values);
        }
    },

    /**
     * Create and submit a model to server
     * @param {String} mode    Either 'create', 'update' or 'destroy'
     * @param {Object} [values]     Optional. Values for the model
     */
    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.main.user.Resource';
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
            Ext.create(modelName, values).save(operationConfig);
        }
    },

    onclickResetBtn: function() {
        this.getUserResourcesGrid().getStore().rejectChanges();
    }
});
