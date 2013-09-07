Ext.define('Aenis.controller.workflow.transaction.type.Manage', {
	extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.workflow.transaction.type.Manage'
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
                '[ref=parentItemSelectAction]': {
                    click: this.onclickSelectParentBtn
                },
                '[ref=parentItemResetAction]': {
                    click: this.onclickResetParentBtn
                },
                '[ref=itemsTree]': {
                    selectionchange: this.onSelectionChangeItemsTree
                },

                '[ref=partyTypesGrid]': {
                    edit: this.editPartyTypesGrid,
                    beforeedit: this.beforeEditPartyTypesGrid,
                    selectionchange: this.onSelectionChangePartyTypesGrid
                },
                '[ref=addPartyTypeAction]': {
                    click: this.onAddPartyType
                },
                '[ref=savePartyTypeAction]': {
                    click: {fn: this.onSavePartyTypes, buffer:BestSoft.eventDelay}
                },
                '[ref=deletePartyTypeAction]': {
                    click: {fn: this.onDeletePartyType, buffer:BestSoft.eventDelay}
                },
                '[action=reset_party_type]': {
                    click: this.onResetPartyTypes
                },

                '[ref=propertyTypesGrid]': {
                    edit: this.editPropertyTypesGrid,
                    beforeedit: this.beforeEditPropertyTypesGrid,
                    selectionchange: this.onSelectionChangePropertyTypesGrid
                },
                '[ref=addPropertyTypeAction]': {
                    click: this.onAddPropertyType
                },
                '[ref=savePropertyTypeAction]': {
                    click: {fn: this.onSavePropertyTypes, buffer:BestSoft.eventDelay}
                },
                '[ref=deletePropertyTypeAction]': {
                    click: {fn: this.onDeletePropertyType, buffer:BestSoft.eventDelay}
                },
                '[action=reset_property_type]': {
                    click: this.onResetPropertyTypes
                },

                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },


    /**
     * Filters party types store by leaving only items
     * which are not present in the party types grid.
     * @param {Boolean} [bEnableAdd]    If given, will enable/disable add action
     * @param {Number} [excludedId]    If given, will be included in the store in any case
     */
    filterPartyTypesStore: function(bEnableAdd, excludedId) {
        var oGrid = this.getPartyTypesGrid();
        oGrid.partyTypesStore.filterBy(function(record) {
            var id = record.getId();
            return ((excludedId!=null && id == excludedId) || -1 == this.findExact('party_type_id', id));
        }, oGrid.getStore());
        if(bEnableAdd)
        {
            if(oGrid.partyTypesStore.getCount() > 0)
            {
                this.getAddPartyTypeAction().enable();
            }
            else
            {
                this.getAddPartyTypeAction().disable();
            }
        }
    },

    editPartyTypesGrid: function(editor, e) {
        this.filterPartyTypesStore(true);
        if(e.field == 'order_in_list' && (e.value != e.originalValue)) //ordering changed, sort store again
        {
            e.grid.getStore().sort('order_in_list', 'ASC');
        }
        if(e.value != e.originalValue)
        {
            if(e.record.dirty)
            {
                this.getSavePartyTypeAction().enable();
            }
            else
            {
                this.updatePartyTypesSaveActionState(e.grid.getStore());
            }
        }
    },

    beforeEditPartyTypesGrid: function(editor, e) {
        if(e.field == 'party_type_id')
            this.filterPartyTypesStore(false, e.value);
    },

    onAddPartyType: function() {
        var oGrid = this.getPartyTypesGrid();
        var model = Ext.create('Aenis.model.workflow.transaction.type.party.Type');
        model.set('party_type_id', oGrid.partyTypesStore.first().getId());
        oGrid.getStore().insert(0, model);
        oGrid.getPlugin('partyTypeCellEditing').startEditByPosition({
            row: 0,
            column: 0
        });
        this.getSavePartyTypeAction().enable(); //at least one record (the newly added) is modified, enable Save button
    },

    onSavePartyTypes: function() {
        var oStore = this.getPartyTypesGrid().getStore();
        oStore.sync({
            scope: this,
            success: function() {
                this.updatePartyTypesSaveActionState(oStore);
            }
        });
    },

    onResetPartyTypes: function() {
        var partyTypesStore = this.getPartyTypesGrid().getStore();
        partyTypesStore.rejectChanges();
        this.getSavePartyTypeAction().disable();
    },

    /**
     * @param {Aenis.model.workflow.transaction.Type} model
     */
    loadPartyTypes: function(model) {
        var partyTypesStore = model.partyTypes();
        if(partyTypesStore.isLoaded())
        {
            this.onPartyTypesStoreLoad(partyTypesStore);
        }
        else
        {
            partyTypesStore.on('load', this.onPartyTypesStoreLoad, this, {single: true});
            partyTypesStore.load();
        }
    },

    onDeletePartyType: function() {
        var oGrid = this.getPartyTypesGrid();
        var selectionModel = oGrid.getSelectionModel();
        if(selectionModel.hasSelection())
        {
            var oStore = oGrid.getStore();
            oStore.remove(selectionModel.getLastSelected());
            this.onSavePartyTypes();
            this.filterPartyTypesStore(true);
        }
    },

    onSelectionChangePartyTypesGrid: function(selection) {
        if(selection.hasSelection())
            this.getDeletePartyTypeAction().enable();
        else
            this.getDeletePartyTypeAction().disable();
    },

    onPartyTypesStoreLoad: function(oStore) {
        var oGrid = this.getPartyTypesGrid();
        oGrid.getSelectionModel().deselectAll();
        oGrid.reconfigure(oStore);
        oStore.sort('order_in_list', 'ASC');
        this.updatePartyTypesSaveActionState(oStore);
        this.getPartyTypesPanel().enable();
        this.filterPartyTypesStore(true);
    },

    updatePartyTypesSaveActionState: function(oStore) {
        if(oStore.getModifiedRecords().length > 0)
            this.getSavePartyTypeAction().enable();
        else
            this.getSavePartyTypeAction().disable();
    },



    /**
     * Filters property types store by leaving only items
     * which are not present in the property types grid.
     * @param {Boolean} [bEnableAdd]    If given, will enable/disable add action
     * @param {Number} [excludedId]    If given, will be included in the store in any case
     */
    filterPropertyTypesStore: function(bEnableAdd, excludedId) {
        var oGrid = this.getPropertyTypesGrid();
        oGrid.propertyTypesStore.filterBy(function(record) {
            var id = record.getId();
            return ((excludedId!=null && id == excludedId) || -1 == this.findExact('property_type_id', id));
        }, oGrid.getStore());
        if(bEnableAdd)
        {
            if(oGrid.propertyTypesStore.getCount() > 0)
            {
                this.getAddPropertyTypeAction().enable();
            }
            else
            {
                this.getAddPropertyTypeAction().disable();
            }
        }
    },

    editPropertyTypesGrid: function(editor, e) {
        this.filterPropertyTypesStore(true);
        if(e.field == 'order_in_list' && (e.value != e.originalValue)) //ordering changed, sort store again
        {
            e.grid.getStore().sort('order_in_list', 'ASC');
        }
        if(e.value != e.originalValue)
        {
            if(e.record.dirty)
            {
                this.getSavePropertyTypeAction().enable();
            }
            else
            {
                this.updatePropertyTypesSaveActionState(e.grid.getStore());
            }
        }
    },

    beforeEditPropertyTypesGrid: function(editor, e) {
        if(e.field == 'property_type_id')
            this.filterPropertyTypesStore(false, e.value);
    },

    onAddPropertyType: function() {
        var oGrid = this.getPropertyTypesGrid();
        var model = Ext.create('Aenis.model.workflow.transaction.type.property.Type');
        model.set('property_type_id', oGrid.propertyTypesStore.first().getId());
        oGrid.getStore().insert(0, model);
        oGrid.getPlugin('propertyTypeCellEditing').startEditByPosition({
            row: 0,
            column: 0
        });
        this.getSavePropertyTypeAction().enable(); //at least one record (the newly added) is modified, enable Save button
    },

    onSavePropertyTypes: function() {
        var oStore = this.getPropertyTypesGrid().getStore();
        oStore.sync({
            scope: this,
            success: function() {
                this.updatePropertyTypesSaveActionState(oStore);
            }
        });
    },

    onResetPropertyTypes: function() {
        var propertyTypesStore = this.getPropertyTypesGrid().getStore();
        propertyTypesStore.rejectChanges();
        this.getSavePropertyTypeAction().disable();
    },

    /**
     * @param {Aenis.model.workflow.transaction.Type} model
     */
    loadPropertyTypes: function(model) {
        var propertyTypesStore = model.propertyTypes();
        if(propertyTypesStore.isLoaded())
        {
            this.onPropertyTypesStoreLoad(propertyTypesStore);
        }
        else
        {
            propertyTypesStore.on('load', this.onPropertyTypesStoreLoad, this, {single: true});
            propertyTypesStore.load();
        }
    },

    onDeletePropertyType: function() {
        var oGrid = this.getPropertyTypesGrid();
        var selectionModel = oGrid.getSelectionModel();
        if(selectionModel.hasSelection())
        {
            var oStore = oGrid.getStore();
            oStore.remove(selectionModel.getLastSelected());
            this.onSavePropertyTypes();
            this.filterPropertyTypesStore(true);
        }
    },

    onSelectionChangePropertyTypesGrid: function(selection) {
        if(selection.hasSelection())
            this.getDeletePropertyTypeAction().enable();
        else
            this.getDeletePropertyTypeAction().disable();
    },

    onPropertyTypesStoreLoad: function(oStore) {
        var oGrid = this.getPropertyTypesGrid();
        oGrid.getSelectionModel().deselectAll();
        oGrid.reconfigure(oStore);
        oStore.sort('order_in_list', 'ASC');
        this.updatePropertyTypesSaveActionState(oStore);
        this.getPropertyTypesPanel().enable();
        this.filterPropertyTypesStore(true);
    },

    updatePropertyTypesSaveActionState: function(oStore) {
        if(oStore.getModifiedRecords().length > 0)
            this.getSavePropertyTypeAction().enable();
        else
            this.getSavePropertyTypeAction().disable();
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
        this.getItemsTree().getStore().reload();
        this.onclickResetBtn();
    },

    onclickSelectParentBtn: function() {
        var oController = this.application.loadController('workflow.transaction.type.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                this.getParentItemField().setValue(model.getTitle());
                this.getParentItemField().parentId = model.getId();
                this.getParentItemResetAction().enable();
            },
            scope: this
        });
    },

    onclickResetParentBtn: function() {
        this.getParentItemField().reset();
        this.getParentItemResetAction().disable();
        this.getParentItemField().parentId = 0;
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
        var oGrid = this.getItemsTree();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
            this.submitModel('destroy', {
                id: selection[0].data.id
            });
    },

    onAfterRenderMainView: function(oView) {
        oView.showConditionalElements();
        var oTree = this.getItemsTree();
        oTree.mask();
        oTree.languagesStore.load({
            scope: this,
            callback: function(records, operation) {
                if(operation.wasSuccessful())
                {
                    this.generateContentDetailsTabs(records);
                    oTree.unmask();
                    oTree.loadStore({params:{detailed:1}});
                }
            }
        });
    },

    /**
     * Create and submit a model to server
     * @param {String} mode    Either 'create', 'update' or 'destroy'
     * @param {Object} [values]     Optional. Values for the model
     */
    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.workflow.transaction.Type';
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
            values.parent_id = this.getParentItemField().parentId;

            values.contentData = {};
            var oTabs = this.getContentDetailsTabs();
            var fields = oTabs.query('[name]');
            for(var j=fields.length-1; j>=0; --j)
            {
                var field = fields[j];
                if(!Ext.isObject(values.contentData[field.langId]))
                    values.contentData[field.langId] = {};
                values.contentData[field.langId][field.name] = field.getValue();
            }
            Ext.create(modelName, values).save(operationConfig);
        }
    },

    generateContentDetailsTabs: function(records) {
        var oTabs = this.getContentDetailsTabs();
        for(var i=0; i<records.length; ++i)
        {
            var record = records[i];
            var cfg = {
                layout: 'fit',
                iconCls: 'lang-' + record.get('code'),
                tabConfig: {
                    title: record.get('title')
                }
            };
            var oView = Ext.ComponentManager.create(oTabs.tabContentConfig);
            var fields = oView.query('[name]');
            for(var j=fields.length-1; j>=0; --j)
            {
                fields[j].langId = record.get('id');
            }
            oTabs.add(cfg).add(oView);
        }
        oTabs.setActiveTab(0);
    },


    /**
     * @param {Aenis.model.workflow.transaction.Type} model
     */
    loadRecordContent: function(model) {
        //load multilingual data
        var oTabs = this.getContentDetailsTabs();
        var fields = oTabs.query('[name]');
        for(var j=fields.length-1; j>=0; --j)
        {
            var field = fields[j];
            var contentModel = model.content().getById(field.langId);
            if(contentModel)
            {
                field.setValue(contentModel.get(field.name));
            }
            else
            {
                field.reset();
            }
        }
        this.loadPartyTypes(model); //load party types
        this.loadPropertyTypes(model); //load property types
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getParentItemResetAction().disable();
        this.getParentItemSelectAction().enable();
        this.getParentItemField().parentId = 0;
        this.getItemsTree().getSelectionModel().deselectAll();
    },

    onSelectionChangeItemsTree: function(model, selected) {
        var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
            this.loadRecordContent(selected[0]);
            if(selected[0].data.parent_id)
            {
                this.getParentItemField().setValue(selected[0].get('parent_label'));
                this.getParentItemField().parentId = selected[0].get('parent_id');
                this.getParentItemResetAction().enable();
            }
            else
            {
                this.onclickResetParentBtn();
            }
            this.getEditAction().enable();
            this.getDeleteAction().enable();
        }
        else
        {
            this.getPartyTypesPanel().disable();
            this.getPropertyTypesPanel().disable();
            this.getDeleteAction().disable();
            this.onclickResetBtn();
        }
    }
});
