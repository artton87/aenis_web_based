Ext.define('Aenis.controller.workflow.will.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.will.Manage',
        'Aenis.model.workflow.Transaction',
        'Aenis.model.workflow.transaction.Type'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                '[ref=selectTransactionTypeAction]': {
                    click: this.onClickSelectTransactionType
                },
                '[ref=willsGrid]': {
                    selectionchange: this.onSelectionChangeGrid
                },
                '[action=create_party_by_type]': {
                    click: this.onCreatePartyByTypeAction
                },
                '[ref=objectsGrid]': {
                    validateSelection: this.onValidateObjectSelection
                },
                '[ref=docContentEditor]': {
                    afterrender: this.onAfterRenderDocContentEditor
                },
                '[ref=resetAction]': {
                    click: this.onResetAction
                },
                '[ref=addAction]': {
                    click: {fn: this.onAddAction, buffer:BestSoft.eventDelay}
                },
                '[ref=unlockAction]': {
                    click: {fn: this.onUnlockAction, buffer:BestSoft.eventDelay}
                },
                '[ref=approveAction]':{
                    click:this.onClickApproveAction
                },
                '[ref=viewAction]':{
                    click:this.onclickViewActionBtn
                },
                '[ref=viewCompleteAction]':{
                    click:this.onclickViewCompleteAction
                },
                '[ref=isPaidAction]':{
                    click: this.onClickIsPaidAction
                },
                '[ref=detailsForm]': {
                    afterrender: this.onAfterRenderDetailsForm,
                    beforeaction: this.onFormBeforeAction,
                    actioncomplete: this.onFormActionComplete,
                    actionfailed: this.onFormActionFailed
                }
            }, null, this);

        });
    },

    onAfterRenderDocContentEditor: function(editor) {
        editor.setVariableSubstituteConfig({
            scope: this,
            fn: this.variableSubstituteFn
        });
    },

    onClickIsPaidAction: function(){
        var selection = this.getWillsGrid().getSelectionModel().getSelection();
        var me=this;
        if(selection.length > 0)
        {
            if(selection[0].get('tr_status_code') == "approved" && selection[0].get('is_paid') == false )
            {
                Ext.Ajax.request({
                    url: 'workflow/transaction/is_paid.php',
                    method: 'POST',
                    params: {
                        transaction_id: selection[0].getId()
                    },
                    callback: function(options, success, response) {
                        if(me.application.handleAjaxResponse(response))
                        {
                            response = Ext.JSON.decode(response.responseText);
                            if(response.success)
                            {
                                selection[0].set('is_paid',1);
                                selection[0].commit();
                                Ext.MessageBox.alert({
                                    title: me.application.title,
                                    msg: me.getDetailsForm().messages.transaction_is_paid,
                                    icon: Ext.MessageBox.INFO, buttons: Ext.MessageBox.OK
                                });
                            }
                        }
                    }
                });
            }
        }
    },


    onclickViewCompleteAction: function(){
        var selection = this.getWillsGrid().getSelectionModel().getSelection();
        var me = this;
        if(selection.length > 0)
        {
            Ext.create('Aenis.model.workflow.Transaction',{id:selection[0].getId()}).reload(
                {
                    params: {
                        info: 'relationships,relationship_documents,relationship_document_files,'
                    }
                },
                function(record, operation/*, success*/){
                    var trTypeModel = me.getTransactionTypeField().transactionModel;
                    var docModel = record.relationships().first().documents().findRecord('tr_type_id',trTypeModel.getId(), false, false, false, true);
                    console.log(docModel);
                    var oController = me.application.loadController('Aenis.controller.workflow.document.ViewDlg');
                    oController.showDialog({docModel:docModel});
                }
            );
        }
    },

    onclickViewActionBtn: function(){

        this.getPartiesPanel().actionMode = 'view';

        this.getViewCompleteAction().show();
        this.onResetAction();

        var oGrid = this.getWillsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {

            var me = this,
                transactionId = selection[0].get('id');
            Ext.create('Aenis.model.workflow.Transaction', {id:transactionId}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,' +
                            'objects,object_documents,object_document_files'
                    }
                },
                function(record, operation/*, success*/) {

                    if(operation.wasSuccessful())
                    {
                        me.getAddAction().disable();

                        me.getDetailsForm().transactionModel = record;

                        var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:selection[0].get('tr_type_id')});

                        me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                        me.getTransactionTypeField().transactionModel = trTypeModel;
                        me.getSelectTransactionTypeAction().disable();
                        me.initWithTransactionType(trTypeModel);
                    }
                }
            );
        }
    },


    variableSubstituteFn: function(editor, templateVariableModel, args/*, data*/) {
        var code = templateVariableModel.get('code');
        if(code == 'notary_name_full' || code == 'notary_name_initials')
        {
            var notaryId = this.getNotariesCombo().getValue();
            var notariesStore = this.getNotariesCombo().getStore();
            var notaryModel = notariesStore.getById(parseInt(notaryId));
            if(code == 'notary_name_full')
                return notaryModel.getFullName();
            if(code == 'notary_name_initials')
                return notaryModel.getInitialsName();
        }
        else if(code == 'transaction_party')
        {
            var partyTypeId = args['party'];
            var partiesPanel = this.getPartiesPanel();
            var oPartyGrid = partiesPanel.down('[partyTypeId='+partyTypeId+']');
            console.log(oPartyGrid);
            if(oPartyGrid)
            {
                var subjects = oPartyGrid.getStore().getFieldData('contactName');
                return subjects.join(', ');
            }
        }
        else if(code == 'transaction_property')
        {
            var propertyTypeId = parseInt(args['property']);
            var oPropertiesGrid = this.getPropertiesGrid();
            var propertyModel = oPropertiesGrid.getStore().getById(propertyTypeId);
            if(propertyModel)
                return propertyModel.getDisplayValue();
        }
        else if(Ext.Array.contains(['vehicleObjects', 'shareObjects', 'stockObjects', 'realtyObjects', 'otherObjects'], code))
        {
            var singleCode = code.split("Objects");
            singleCode = singleCode[0];
            var text = "";
            this.getObjectsGrid().getStore().each(function(model){
                if(model.get('objectType') == singleCode)
                {
                    text += editor.parse(templateVariableModel.get('content'), {objectModel:model});
                }
            });
            return text;
        }
        else if(Ext.Array.contains(['vehicle', 'share', 'stock', 'realty', 'other'], code))
        {
            return this.getObjectVariableValue(code, editor, templateVariableModel, args);
        }
        return null;
    },

    getObjectVariableValue: function(objectType, editor, templateVariableModel, args/*, data*/) {
        var objectModel = null;
        this.getObjectsGrid().getStore().each(function(model){
            if(model.get('objectType') == objectType)
            {
                objectModel = model;
                return false;
            }
            return true;
        });
        return objectModel ? objectModel.get('objectData')[args.property] : '';
    },


    onClickSelectTransactionType: function() {
        var oController = this.application.loadController('workflow.transaction.type.SelectDlg');
        oController.showDialog({uiType: 'will'}).on({
            itemSelected: function(model) {
                this.getTransactionTypeField().setValue(model.getTitle());
                this.getTransactionTypeField().transactionModel = model;
                this.initWithTransactionType(model);
            },
            scope: this
        });
    },

    onResetAction: function() {
        Ext.suspendLayouts();
        var trTypeModel = this.getTransactionTypeField().transactionModel;
        if(trTypeModel)
        {
            this.removePartyPanels();
            var partyTypesStore = trTypeModel.partyTypes();
            if(partyTypesStore.isLoaded())
                this.createPartyPanels(partyTypesStore);

            var propertyTypesStore = trTypeModel.propertyTypes();
            if(propertyTypesStore.isLoaded())
                this.getPropertiesGrid().resetStore();
        }
        this.getDetailsForm().getForm().reset();
        this.getObjectsGrid().freeStore();
        this.getRelationshipDocumentsGrid().freeStore();
        Ext.resumeLayouts(true);
    },


    onAddAction: function() {
        this.getDocContentEditor().triggerSave();
        var oForm = this.getDetailsForm().getForm();
        oForm.submit({params:{}});
    },


    onSaveAction: function() {
        this.getDocContentEditor().triggerSave();
        var oFormCmp = this.getDetailsForm();
        oFormCmp.getForm().submit({
            params: {
                id: oFormCmp.transactionModel.getId()
            }
        });
    },


    onFormBeforeAction: function(oForm, action) {
        var oFormCmp = this.getDetailsForm();
        if(this.getDocContentEditor().getValue() == "") {
            Ext.Msg.alert(
                this.application.title,
                oFormCmp.messages["doc_content_empty"]
            );
            return false;
        }

        var data = {
            notary_id: parseInt(this.getNotariesCombo().getValue()),
            tr_type_id: this.getTransactionTypeField().transactionModel.getId(),
            parties: [],
            objects: null,
            properties: null
        };

        //collect parties
        var oPanel, partyTypeModel,
            oPartiesStore = this.getPartyTypesCombo().getStore(),
            panels = Ext.ComponentQuery.query("[partyTypeId]", this.getPartiesPanel());
        for(var i=0; i<panels.length; ++i)
        {
            oPanel = panels[i];
            partyTypeModel = oPartiesStore.getById(parseInt(oPanel.partyTypeId));
            if(partyTypeModel.get('is_required') && oPanel.isEmpty())
            {
                Ext.Msg.alert(
                    this.application.title,
                    Ext.String.format(
                        oFormCmp.messages["party_subjects_empty"],
                        Ext.String.capitalize(partyTypeModel.get('party_type_label'))
                    )
                );
                return false;
            }
            if(!oPanel.isValid()) //panel is not empty, but may contain invalid records
            {
                Ext.Msg.alert(
                    this.application.title,
                    Ext.String.format(
                        oFormCmp.messages["party_subjects_invalid"],
                        Ext.String.capitalize(partyTypeModel.get('party_type_label'))
                    )
                );
                return false;
            }
            data.parties.push({
                party_type_id: oPanel.partyTypeId,
                data: oPanel.getSubjectRecords()
            });
        }

        //collect objects
        if(this.getObjectsGrid().isEmpty())
        {
            Ext.Msg.alert(this.application.title, oFormCmp.messages["objects_empty"]);
            return false;
        }
        if(!this.getObjectsGrid().isValid()) //objects list is not empty, but may contain invalid records
        {
            Ext.Msg.alert(this.application.title, oFormCmp.messages["objects_invalid"]);
            return false;
        }
        data.objects = this.getObjectsGrid().getObjectRecords();

        //collect properties
        var failedRecord = this.getPropertiesGrid().getFirstFailedRecord();
        if(failedRecord)
        {
            Ext.Msg.alert(
                this.application.title,
                Ext.String.format(
                    oFormCmp.messages["required_property_missing"],
                    failedRecord.get('label')
                )
            );
            return false;
        }
        data.properties = this.getPropertiesGrid().getRecords();

        //collect relationship documents
        if(!this.getRelationshipDocumentsGrid().isValid()) //relationship document list may contain invalid records
        {
            Ext.Msg.alert(this.application.title, oFormCmp.messages["relationship_documents_invalid"]);
            return false;
        }
        data.relationship_documents = this.getRelationshipDocumentsGrid().getFileRecords();

        action.params['data'] = Ext.JSON.encode(data);
        return true;
    },


    onFormActionComplete: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            this.onResetAction();
            var msg;
            if(null == this.getDetailsForm().transactionModel) //adding completed
            {
                msg = 'createSuccess';
            }
            else //editing completed
            {
                msg = 'updateSuccess';
                this.onUnlockActionUpdateControls();
                this.resetTransactionType();
            }
            Ext.Msg.show({
                title: this.application.title,
                msg: this.getDetailsForm().messages[msg],
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            this.getWillsGrid().getStore().reload();
        }
    },

    onFormActionFailed: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            if(action.failureType == Ext.form.action.Action.SERVER_INVALID)
            {
                var obj = Ext.JSON.decode(action.response.responseText);
                Ext.Msg.alert(this.application.title, obj.errors.reason);


            }
            var panels = Ext.ComponentQuery.query("[partyTypeId]", this.getPartiesPanel());
            for(var i=0; i<panels.length; ++i)
            {
                panels[i].resetFileFields();
            }

            this.getObjectsGrid().resetFileFields();
            this.getRelationshipDocumentsGrid().resetFileFields();
        }
    },


    onAfterRenderDetailsForm: function(oForm) {
        oForm.loadingProgressStore.on('add', this.onAddDetailsFormLoadingProgressStore, this);
    },


    onAddDetailsFormLoadingProgressStore: function(loadingProgressStore) {
        var shouldBeLoaded = ['parties', 'properties'];
        for(var i=shouldBeLoaded.length-1; i>=0; --i) //check if all items which should be loaded are loaded
        {
            if(null == loadingProgressStore.findRecord('loaded_item', shouldBeLoaded[i], false, true, true))
            {
                return; //i-th item is not loaded yet, do not continue
            }
        }

        //if we are here, all items were loaded
        this.getDetailsForm().setLoading(false); //enable the form
        loadingProgressStore.removeAll(); //empty the progress store for future use

        //we have completed loading
        this.initWithTransactionTypeCompleted();
    },


    initWithTransactionTypeCompleted: function() {
        var oForm = this.getDetailsForm();
        var transactionModel = oForm.transactionModel;
        if(transactionModel) //we are in editing mode
        {
            //ensure, that a party panel is created for each party
            var relModel = transactionModel.relationships().first();
            var partyStore = relModel.parties();
            partyStore.each(function(partyModel) {
                var partyTypeId = partyModel.get('party_type_id');
                var partiesPanel = this.getPartiesPanel();
                var partyCmp = partiesPanel.down('[partyTypeId='+partyTypeId+']');
                if(!partyCmp) //if party panel is not created yet
                {
                    partyCmp = this.createPartyByType(partyTypeId); //create it ????///review
                }
                partyCmp.loadFromSubjectsStore(partyModel.subjects()); //load subjects into panel
            }, this);

            //we finished adding party components for each needed type, now filter party types store
            this.filterPartyTypesStore();

            //load properties
            var propertiesStore = transactionModel.properties();
            var propertiesGrid = this.getPropertiesGrid();
            propertiesStore.each(function(propertyModel) {
                var propertyTypeId = propertyModel.getId();
                var el = oForm.down("[propertyTypeId="+propertyTypeId+"]");
                if(el)
                {
                    el.setValue(propertyModel.get('value'));
                }
                else
                {
                    propertiesGrid.setPropertyValue(propertyTypeId, propertyModel.get('value'));
                }
            }, this);

            //load objects
            this.getObjectsGrid().loadFromObjectsStore(relModel.objects()); //load objects into panel

            //load relationship documents
            this.getRelationshipDocumentsGrid().loadFromDocumentsStore(relModel.documents()); //load documents into panel
        }
    },

    onUnlockActionUpdateControls: function() {
        this.getWillsGrid().enable();
        this.getAddAction().enable();
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


    /**
     * Called when transaction type is being selected.
     * Initializes UI parts and loads all related stores.
     * @param {Aenis.model.workflow.transaction.Type} trTypeModel    Transaction type model
     */
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

        if(this.getPartiesPanel().actionMode)
        {
            if(this.getPartiesPanel().actionMode == 'view')
            {
                var panels = Ext.ComponentQuery.query("[partyTypeId]", this.getPartiesPanel());
                for(var i=0; i<panels.length; ++i)
                {
                    panels[i].down('toolbar').hide();
                }
                this.getObjectsGrid().down('toolbar').hide();
                this.getRelationshipDocumentsGrid().down('toolbar').hide();
                this.getDocContentEditor().getEditor().setReadOnly(true);
                delete this.getPartiesPanel().actionMode;
            }

        }
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


    /**
     * Creates panel for each party type
     * @param {Ext.data.Store} store    A store of Aenis.model.workflow.transaction.type.party.Type models
     */
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


    /**
     * Removes all party panels
     */
    removePartyPanels: function() {
        this.getPartiesTopBar().hide();
        this.getPartiesPanel().removeAll(true);
    },


    onCreatePartyByTypeAction: function() {
        this.createPartyByType(parseInt(this.getPartyTypesCombo().getValue()));
    },


    /**
     * Creates an UI block for party input
     * @param {Aenis.model.workflow.transaction.type.party.Type|Number} partyTypeModel    Either model or party type id
     * @return {Aenis.view.main.contact.components.SelectionGrid}    A created component for input of party subjects
     */
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


    /**
     * Filters party types store by excluding items for which a party component is created
     */
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


    onValidateObjectSelection: function(oGrid, mode, newRecord/*, oldRecord*/){
        if(oGrid.objectExists(newRecord))
        {
            Ext.Msg.show({
                title: this.application.title,
                msg: oGrid.msgObjectExists,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        return true;
    },


    onSelectionChangeGrid: function(selModel, selected) {
        this.getViewAction().enable();
        this.getApproveAction().disable();
        this.getViewCompleteAction().disable();
        if(selected.length > 0)
        {

            if(selected[0].get('tr_status_code') == 'approved')
            {
                this.getViewCompleteAction().enable();
                this.getIsPaidAction().enable();
            }

            if(selected[0].get('tr_status_code') != 'approved')
            {
                this.getApproveAction().enable();
            }
        }
    },

    onClickApproveAction: function(){
        var selection = this.getWillsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var oController = this.application.loadController('workflow.will.ApproveDlg');
            oController.showDialog({model:selection[0]}).on({
                actionCompleted: function() {
                    this.getWillsGrid().loadStore();
                    this.onResetAction();
                    this.getApproveAction().disable();
                },
                scope: this
            });
        }
    }
});
