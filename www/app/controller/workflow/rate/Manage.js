Ext.define('Aenis.controller.workflow.rate.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.rate.Manage',
        'Aenis.store.workflow.Rates'
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
                '[ref=transactionTypeSelectAction]': {
                    click: this.onclickSelectTransactionTypeBtn
                },
                '[ref=transactionTypeResetAction]': {
                    click: this.onclickResetTransactionTypeBtn
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },


    onclickSelectTransactionTypeBtn: function() {
        var oController = this.application.loadController('workflow.transaction.type.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                this.getTransactionTypeField().setValue(model.getTitle());
                this.getTransactionTypeField().tr_type_id = model.getId();
				console.log(model.getId());
                this.getTransactionTypeResetAction().enable();
            },
            scope: this
        });
    },

    onclickResetTransactionTypeBtn: function() {
        this.getTransactionTypeField().reset();
        this.getTransactionTypeResetAction().disable();
        this.getTransactionTypeField().transactionTypeId = 0;
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

    onclickAddBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
        {
            /*var oStore = this.getTypesGrid().getStore();
            oStore.add(oForm.getValues());*/

			var values = oForm.getValues();
			values.id = 0;
			values.tr_type_id = this.getTransactionTypeField().tr_type_id;
			var model = Ext.create('Aenis.model.workflow.Rate', values);
			model.save({
				scope: this,
				callback: this.modelSyncHandler
			});
        }
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();

		/*var oGrid = this.getTypesGrid();
		var selection = oGrid.getSelectionModel().getSelection();
		if(selection.length > 0)
		{
			oForm.submit({
				params: {
					id: selection[0].getId()
				}
			});
		}*/

		if(oForm.isValid())
		{
			var values = oForm.getValues();
			values.id = oForm.getRecord().get('id');
			values.tr_type_id = this.getTransactionTypeField().tr_type_id;
			var model = Ext.create('Aenis.model.workflow.Rate', values);
			model.save({
				scope: this,
				callback: this.modelSyncHandler
			});
		}
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getTypesGrid();
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
        this.getTypesGrid().getSelectionModel().deselectAll();
    },

    onSelectionChangeTypesGrid: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
			//console.log(selected[0]);
			if(selected[0].data.id)
			{
				this.getTransactionTypeField().setValue(selected[0].get('tr_type_label'));
				this.getTransactionTypeField().tr_type_id = selected[0].get('tr_type_id');
				this.getInheritorTypes().setValue(selected[0].get('inheritor_type_id'));
				this.getParcelPurposeTypes().setValue(selected[0].get('parcel_purpose_type_id'));
				this.getBuildingTypes().setValue(selected[0].get('building_type_id'));
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
		this.getTypesGrid().getStore().reload();
		this.onclickResetBtn();
	},

	onclickResetBtn: function() {
		this.getDetailsForm().getForm().reset();
		this.getEditAction().disable();
		this.getTransactionTypeResetAction().disable();
		this.getTransactionTypeSelectAction().enable();
		this.getTransactionTypeField().reset();
		this.getTransactionTypeField().tr_type_id = 0;
	}

});
