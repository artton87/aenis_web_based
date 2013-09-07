Ext.define('Aenis.controller.workflow.inheritance.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.inheritance.Manage'
    ],

    mixins:[
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
               '[ref=deadManSearchButton]': {
                    click: this.deadManSearchAction
                },
                '[ref=createDeathInheritance]': {
                    click: this.onClickCreateDeathInheritanceAction
                },
                '[ref=selectTransactionTypeAction]': {
                    click: this.onClickSelectTransactionTypeActionAction
                },
                '.':{
                    afterrender: this.onAfterRenderAction
                }
            }, null, this);
        });
    },
      onValidateContactSelection: function(oGrid, mode, newRecord/*, oldRecord*/) {
        var bOk = true,
            me = this,
            partiesPanel = this.getPartiesPanel();
        partiesPanel.items.each(function(item) {
            if(item.contactExists(newRecord))
            {
                Ext.Msg.show({
                    title: me.application.title,
                    msg: partiesPanel.msgSubjectExists,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                bOk = false;
                return false;
            }
            return true;
        });
        return bOk;
    },          
            
    onAfterRenderAction: function(){

    },
    
    deadManSearchAction: function(){
            var form = this.getInheritanceSearchForm().getForm();
            var values = form.getValues();
                values.loadMode = 'from_inheritance';
        var me = this;
        this.getInheritancesGrid().loadStore({
                params:values,
               callback:function(records/*, operation, success*/){
                    
                    me.getWillsGrid().show();
                    me.getWillsGrid().loadStore({
                        params:values
                    });
                }
            });
    },

    onClickSelectTransactionTypeActionAction: function(){
         var oController = this.application.loadController('workflow.transaction.type.SelectDlg');
		oController.showDialog({uiType: 'inheritance_final_part'}).on({
			itemSelected: function(model) {
				this.getTransactionTypeField().setValue(model.getTitle());
				this.getTransactionTypeField().transactionModel = model;
				this.initWithTransactionType(model);
			},
			scope: this
		});
    },
    
        propertyTypesStoreLoaded: function(store) {
        var oGrid = this.getPropertiesGrid(),
            oContainer = this.getDetailsForm(),
            uiRecords = [];
        store.each(function(record) {
            var code = record.get('property_type_code');
            var el = oContainer.down("[propertyTypeCode="+code+"]");
            if(code && el)
            {
                el.propertyTypeId = record.getId();
                uiRecords.push(record);
            }
        });
        store.suspendEvents();
        store.remove(uiRecords);
        store.resumeEvents();
        store.commitChanges();
        oGrid.setPropertyTypesStore(store);
        this.getDetailsForm().loadingProgressStore.add({loaded_item: 'properties'});
    },
            
    resetTransactionType: function() {
        this.getTransactionTypeField().reset();
        this.getTransactionTypeField().transactionModel = null;
        this.getSelectTransactionTypeAction().enable();
        var oFormCmp = this.getDetailsForm();
        this.removePartyPanels();
        oFormCmp.down('tabpanel').setActiveTab(this.getPartiesPanel());
        oFormCmp.disable();
    },
    
        initWithTransactionType: function(trTypeModel) {
        var transactionTypeId = trTypeModel.getId();

        //init content editor
        var oEditor = this.getDocContentEditor();
        oEditor.setTransactionTypeId(transactionTypeId);

        // Enable transaction input/edit form and start loading.
        // When loading will be finished, form will enable automatically after calling setLoading(false)
        var oForm = this.getDetailsForm();
        oForm.enable();
        oForm.setLoading(true);

        //prepare parties UI
        var partyTypesStore = trTypeModel.partyTypes();
            console.log(partyTypesStore);
        this.removePartyPanels();
        partyTypesStore.on('load', this.partyTypesStoreLoaded, this, {single: true});
        partyTypesStore.load();

        //prepare properties UI
        var propertyTypesStore = trTypeModel.propertyTypes();
        propertyTypesStore.on('load', this.propertyTypesStoreLoaded, this, {single: true});
        propertyTypesStore.load();
    },
            
    partyTypesStoreLoaded: function(partyTypesStore) {
        this.createPartyPanels(partyTypesStore);
        this.getDetailsForm().loadingProgressStore.add({loaded_item: 'parties'});
    },
            
    createPartyPanels: function(store) {
        Ext.suspendLayouts();
        var me = this;
        store.each(function(record) {
            if(record.get('is_required'))
                me.createPartyByType(record);
        });
        var oCombo = this.getPartyTypesCombo();
        oCombo.bindStore(store);
        this.filterPartyTypesStore();
        Ext.resumeLayouts(true);
    },
            
    createPartyByType: function(partyTypeModel) {
        if(Ext.isNumber(partyTypeModel))
        {
            var partyTypeId = partyTypeModel;
            partyTypeModel = this.getPartyTypesCombo().getStore().getById(parseInt(partyTypeId));
        }
        var partiesPanel = this.getPartiesPanel();
        var partyCmpCfg = Ext.clone(partiesPanel.partyComponentConfig);
        Ext.apply(partyCmpCfg, {
            title: partyTypeModel.get('party_type_label'),
            closable: partyTypeModel.get('is_required') ? false : true,
            partyTypeId: partyTypeModel.getId(),
            listeners: {
                destroy: {fn: this.filterPartyTypesStore, scope: this, single: true},
                render: {fn: this.filterPartyTypesStore, scope: this, single: true},
                validateSelection: {fn: this.onValidateContactSelection, scope: this}
            }
        });
        var partyCmp = Ext.ComponentManager.create(partyCmpCfg);
        partiesPanel.add(partyCmp);
        return partyCmp;
    },


    filterPartyTypesStore: function() {
        var partiesPanel = this.getPartiesPanel(),
            oCombo = this.getPartyTypesCombo();
        if(!oCombo) return;
        var partyTypesStore = oCombo.getStore();
        partyTypesStore.filterBy(function(record) {
            var id = record.getId();
            return (partiesPanel.down('[partyTypeId='+id+']')) ? false : true;
        }, partiesPanel);

        var firstItem = partyTypesStore.first();
        if(firstItem) //if after filtering there are items remaining, select the first one
        {
            oCombo.select(firstItem);
            this.getPartiesTopBar().show();
        }
        else //if all items are filtered out, completely disable top bar with combobox
        {
            this.getPartiesTopBar().hide();
        }
    },
            
    removePartyPanels: function() {
        this.getPartiesTopBar().hide();
        this.getPartiesPanel().removeAll(true);
    },
    
    onClickCreateDeathInheritanceAction: function(){
        var me = this;
        var full_tr_list = [];
        this.getDetailsForm().show();
        var inheritancesGrid = this.getInheritancesGrid();
        var willsGrid = this.getWillsGrid();
        willsGrid.getStore().each(function(record){
            full_tr_list.push(record.getId());
        });
        inheritancesGrid.getStore().each(function(record){
            full_tr_list.push(record.getId());
        });
        me.getRelationshipDocumentsGrid().freeStore();
        me.getObjectsGrid().freeStore();
        me.getPartiesPanel().removeAll(true);
        full_tr_list.forEach(function(tr_id){ 
             Ext.create('Aenis.model.workflow.Transaction', {id:tr_id}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,party_rights,' +
                            'subjects,subject_documents,subject_document_files,subject_relations,' +
                            'objects,object_documents,object_document_files'
                    }
                },
                function(record, operation/*, success*/) {
                    if(operation.wasSuccessful())
                    {                     
                        me.getObjectsGrid().loadFromObjectsStore(record.relationships().first().objects());
                        me.getRelationshipDocumentsGrid().loadFromDocumentsStore(record.relationships().first().documents());
                        
                    }
                });
         });

        
        
    }
});
