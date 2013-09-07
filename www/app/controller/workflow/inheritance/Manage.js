Ext.define('Aenis.controller.workflow.inheritance.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.inheritance.Manage',
        'Aenis.model.workflow.Transaction',
        'Aenis.model.workflow.transaction.Type'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                '[ref=inheritanceApplicationsGrid]': {
                    itemdblclick: this.onItemDoubleClickView
                },
                '[ref=willsGrid]': {
                    itemdblclick: this.onItemDoubleClickViewWill
                },
                '[ref=editInheritance]': {
                    click: this.onClickViewInheritances
                },
                '[ref=selectTransactionTypeAction]': {
                    click: this.onClickSelectTransactionType
                },
                '[ref=contractsGrid]': {
                    selectionchange: this.onSelectionChangeContractsGrid
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
                '[ref=resetContractAction]': {
                    click: this.onResetAction
                },
                '[ref=addContractAction]': {
                    click: {fn: this.onAddContractAction, buffer:BestSoft.eventDelay}
                },
                '[ref=saveContractAction]': {
                    click: {fn: this.onSaveContractAction, buffer:BestSoft.eventDelay}
                },
                '[ref=editContractAction]': {
                    click: {fn: this.onEditContractAction, buffer:BestSoft.eventDelay}
                },
                '[ref=unlockContractAction]': {
                    click: {fn: this.onUnlockContractAction, buffer:BestSoft.eventDelay}
                },
                '[ref=approveAction]':{
                    click:this.onClickApproveAction
                },
                '[ref=viewContractAction]':{
                    click:this.onclickViewContractActionBtn
                },
                '[ref=resetViewContractAction]':{
                    click:this.onclickResetViewContractActionBtn
                },
                '[ref=viewCompleteContractAction]':{
                    click:this.onclickViewCompleteContractAction
                },
                '[ref=detailsForm]': {
                    afterrender: this.onAfterRenderDetailsForm,
                    beforeaction: this.onFormBeforeAction,
                    actioncomplete: this.onFormActionComplete,
                    actionfailed: this.onFormActionFailed
                },
                '[ref=inheritancesGrid]':{
                   selectionchange: this.onSelectionChangeAction
                },
                '[ref=deadManSearchButton]': {
                    click: this.deadManSearchAction
                },
                '[ref=createDeathInheritance]': {
                    click: this.onClickCreateDeathInheritanceAction
                },
                '[ref=isPaidAction]':{
                    click: this.onClickIsPaidAction
                }
            }, null, this);

        });
    },


    onSelectionChangeAction: function(seleModel, selected){
      if(selected.length > 0)
      {
          this.getEditInheritance().enable();
      }
    },

    onAfterRenderDocContentEditor: function(editor) {
        editor.setVariableSubstituteConfig({
            scope: this,
            fn: this.variableSubstituteFn
        });
    },


    onClickIsPaidAction: function(){
        var selection = this.getInheritancesGrid().getSelectionModel().getSelection();
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

    onItemDoubleClickView: function(){
        var selection = this.getInheritanceApplicationsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var oController = this.application.loadController('workflow.inheritance.application.View');
            oController.showDialog({model:selection[0]}).on({
                actionCompleted: function() {
                    
                },
                scope: this
            });
        }
    },

    onClickViewInheritances: function(){
        this.getPartiesPanel().removeAll(true);
        var selection = this.getInheritancesGrid().getSelectionModel().getSelection();
        var itemId = selection[0].getId();
        var me = this;
        me.getObjectsGrid().freeStore();
        me.getRelationshipDocumentsGrid().freeStore();
                Ext.create('Aenis.model.workflow.Transaction', {id:itemId}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,' +
                            'objects,object_documents,object_document_files'
                    }
                },
                function(record/*, operation, success*/) {
                    //me.getWillSearchGrid().transactionModel = record;
                    Ext.suspendLayouts();
                    var partiesPanel = me.getPartiesPanel();
                    var partiesStore = record.relationships().first().parties();

                    var item;
                    partiesStore.each(function(record){
                            var cfg = {
                                    xtype: 'mainContactSelectionGrid',
                                    margin: '5 4',
                                    resizeHandles: 'w e',
                                    width: 400,
                                    height: 150,
                                    title: record.get('party_type_label'),
                                    partyTypeCode: record.get('party_type_code')
                            };
                            item = Ext.ComponentManager.create(cfg);
                            partiesPanel.add(item);

                            me.getPartiesPanel().down('[partyTypeCode='+record.get('party_type_code')+']').loadFromSubjectsStore(record.subjects());
                            me.getPartiesPanel().down('[partyTypeCode='+record.get('party_type_code')+']').down('toolbar').hide();
                    });

                    var objectsGrid = me.getObjectsGrid();

                    var relationshipStore = record.relationships();

                    var cfg = {
                            xtype: 'workflowObjectSelectionGrid',
                            ref:'objectsGrid',
                            margin: '5 4',
                            resizeHandles: 'w e',
                            width: 400,
                            height:150,
                            dataType:record.getId()
                            //title: me.T('objects')
                    };
                    item = Ext.ComponentManager.create(cfg);
                    objectsGrid.add(item);
                    me.getObjectsGrid().loadFromObjectsStore(relationshipStore.first().objects());
                    me.getObjectsGrid().down('toolbar').hide();

                    var documentsGrid = me.getRelationshipDocumentsGrid();
                    /*var cfg = {
                            xtype: 'workflowFileSelectionGrid',
                            ref:'documentsGrid',
                            margin: '5 4',
                            resizeHandles: 'w e',
                            width: 400,
                            height: 150,
                            dataType:record.getId(),
                            title: me.T('documents')
                    };
                    item = Ext.ComponentManager.create(cfg);
                    documentsPanel.add(item);*/
                    me.getRelationshipDocumentsGrid().loadFromDocumentsStore(relationshipStore.first().documents());
                    me.getRelationshipDocumentsGrid().down('toolbar').hide();
                    me.getDetailsForm().enable();
                    me.getAddContractAction().disable();
                    me.getSaveContractAction().enable();
                    Ext.resumeLayouts(true);
                });
    },

    onItemDoubleClickViewWill: function(){
        var selection = this.getWillsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var oController = this.application.loadController('workflow.will.View');
            oController.showDialog({model:selection[0]}).on({
                actionCompleted: function() {
                    
                },
                scope: this
            });
        }
    },

    onclickViewCompleteContractAction: function(){
        var selection = this.getContractsGrid().getSelectionModel().getSelection();
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

    onclickViewContractActionBtn: function(){

        this.getResetViewContractAction().show();
        this.getViewContractAction().hide();
        this.getViewCompleteContractAction().show();

        var oGrid = this.getContractsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            oGrid.disable();
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
                    oGrid.enable();
                    if(operation.wasSuccessful())
                    {
                            oGrid.disable();
                            me.getSaveContractAction().disable();
                            me.getAddContractAction().disable();
                            me.getResetContractAction().disable();

                            me.getDetailsForm().transactionModel = record;

                            var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:selection[0].get('tr_type_id')});

                            me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                            me.getTransactionTypeField().transactionModel = trTypeModel;
                            me.getSelectTransactionTypeAction().disable();
                        var panels = Ext.ComponentQuery.query("[partyTypeId=7]", me.getPartiesPanel());
                        console.log("aaa");
                        console.log( me.getPartyTypesCombo().getStore().first());
                        console.log(panels);
                        for(var i=0; i<panels.length; ++i)
                        {
                            panels[i].down('toolbar').disable();
                        }
                            me.initWithTransactionType(trTypeModel);
                    }
                }
            );




        }
    },

    onclickResetViewContractActionBtn: function(){
        //this.getPrincipalsGrid().down('toolbar').enable();
        //this.getAgentsGrid().down('toolbar').enable();
        this.getObjectsGrid().down('toolbar').enable();
        this.getRelationshipDocumentsGrid().down('toolbar').enable();
        this.getResetViewContractAction().hide();
        this.getViewContractAction().show();
        this.getSaveContractAction().enable();
        this.getAddContractAction().enable();
        this.getResetContractAction().enable();
        this.resetTransactionType();
        this.getViewCompleteContractAction().hide();
        this.getContractsGrid().unmask();
        this.getDetailsForm().disable();
    },


    variableSubstituteFn: function(editor, templateVariableModel, args/*, data*/) {
        console.log("aaaa");
        var code = templateVariableModel.get('code');
        console.log(code);
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
        oController.showDialog({uiType: 'inheritance_final_part'}).on({
            itemSelected: function(model) {
                this.getTransactionTypeField().setValue(model.getTitle());
                this.getTransactionTypeField().transactionModel = model;
                model.partyTypes().load();
                this.getTransactionTypeField().partyTypeStore = model.partyTypes();
                this.initWithTransactionType(model);
            },
            scope: this
        });
        this.getGridsFieldContainer().enable();
        this.getDetailsForm().disable();
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
        //this.getEditContractAction().show();
        Ext.resumeLayouts(true);
    },


    onAddContractAction: function() {
        this.getDocContentEditor().triggerSave();
        var oForm = this.getDetailsForm().getForm();
        oForm.submit({params:{}});
    },


    onSaveContractAction: function() {
        this.getDocContentEditor().triggerSave();
        var oFormCmp = this.getDetailsForm();
        console.log(oFormCmp);
        console.log(this.getTransactionTypeField().transactionModel.getId());
        oFormCmp.getForm().submit({
            params: {
                id: this.getTransactionTypeField().transactionModel.getId()
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
                this.onUnlockContractActionUpdateControls();
                this.resetTransactionType();
            }
            Ext.Msg.show({
                title: this.application.title,
                msg: this.getDetailsForm().messages[msg],
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            this.getInheritancesGrid().getStore().reload();
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


    onEditContractAction: function() {

        var oGrid = this.getContractsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            //this.getEditContractAction().hide();
            //oGrid.disable();
            var me = this,
                transactionId = selection[0].get('id');
            Ext.create('Aenis.model.workflow.Transaction', {id:transactionId}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,' +
                            'objects,object_documents,object_document_files',
                        lock: 1
                    }
                },
                function(record, operation/*, success*/) {
                    //oGrid.enable();
                    if(operation.wasSuccessful())
                    {
                        me.onResetAction();
                        var loggedInUserId = Ext.state.Manager.get('userId');
                        var lockedUserId = record.get('locked_user_id');
                        //if(loggedInUserId == lockedUserId) //we locked successfully
                       // {
                            //oGrid.disable();
                            me.getSaveContractAction().enable();
                            me.getAddContractAction().disable();

                            me.getDetailsForm().transactionModel = record;

                            var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:selection[0].get('tr_type_id')});

                            me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                            me.getTransactionTypeField().transactionModel = trTypeModel;
                            me.getSelectTransactionTypeAction().disable();
                            me.initWithTransactionType(trTypeModel);
                        //}
                        //else
                        /*{
                            Ext.Msg.alert(
                                me.application.title,
                                Ext.String.format(
                                    oGrid.messages["locked_by_user"],
                                    record.get('locked_user')
                                )
                            );
                        }*/

                        //selection[0].set('locked_user_id', lockedUserId);
                        //selection[0].commit();
                    }
                }
            );
        }
    },


    onUnlockContractAction: function() {
        var oGrid = this.getContractsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var me = this, transactionId = selection[0].get('id');
            oGrid.setLoading(true);
            Ext.Ajax.request({
                url: 'workflow/transaction/unlock.php',
                method: 'POST',
                params: {
                    transaction_id: transactionId
                },
                callback: function(options, success, response) {
                    oGrid.setLoading(false);
                    if(me.application.handleAjaxResponse(response))
                    {
                        response = Ext.JSON.decode(response.responseText);
                        if(response.success)
                        {
                            selection[0].set('locked_user_id', 0);
                            selection[0].commit();
                            me.onResetAction();
                            me.onUnlockContractActionUpdateControls();
                            me.getDetailsForm().transactionModel = null;
                            me.resetTransactionType();
                        }
                    }
                }
            });
        }
    },


    onUnlockContractActionUpdateControls: function() {
        this.getContractsGrid().enable();
        this.getSaveContractAction().disable();
        this.getAddContractAction().enable();
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
        //oForm.enable();
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


    onSelectionChangeContractsGrid: function(selModel, selected) {
        this.getEditContractAction().disable();
        this.getViewContractAction().disable();
        this.getApproveContractAction().disable();
        this.getTerminateContractAction().disable();
        if(selected.length > 0)
        {

            if(selected[0].get('tr_status_code') == 'approved')
            {
                this.getTerminateContractAction().enable();
                this.getViewContractAction().enable();
            }

            /*if(selected[0].get('tr_status_code') != 'approved' && (selected[0].get('locked_user_id') == 0 || Ext.state.Manager.get('userId') == selected[0].get('locked_user_id')) )
            {
                this.getEditContractAction().enable();
            }*/

            this.getEditContractAction().enable();
            if(selected[0].get('locked_user_id') > 0)
            {
                //this.getUnlockContractAction().enable();
            }
            else
            {
                if(selected[0].get('tr_status_code') != 'approved')
                {
                    this.getApproveContractAction().enable();
                }

            }




           /* var contractModel = selected[0];

            var loggedInUserId = Ext.state.Manager.get('userId');
            var lockedUserId = contractModel.get('locked_user_id');
            if(lockedUserId == loggedInUserId)
            {
                this.getUnlockContractAction().enable();
            }

            var status = contractModel.get('tr_status_code');
            if( (status == 'in_progress' || status == 'new')
                &&
                (lockedUserId == 0 || lockedUserId == loggedInUserId)
              )
            {
                this.getEditContractAction().enable();
            }

            if(selected[0].get('tr_status_code') == 'approved')
            {
                this.getTerminateContractAction().enable();
                this.getViewContractAction().enable();
            }

            if(selected[0].get('tr_status_code') != 'approved' && (selected[0].get('locked_user_id') == 0 || Ext.state.Manager.get('userId') == selected[0].get('locked_user_id')) )
            {
                this.getEditContractAction().enable();
            }

            if(selected[0].get('locked_user_id') > 0)
            {
                this.getUnlockContractAction().enable();
            }
            else
            {
                if(selected[0].get('status') != 'approved')
                {
                    this.getApproveContractAction().enable();
                }
            }*/
        }
    },

    onClickApproveAction: function(){
        var selection = this.getInheritancesGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var oController = this.application.loadController('workflow.inheritance.ApproveDlg');
            oController.showDialog({model:selection[0]}).on({
                actionCompleted: function() {
                    this.getContractsGrid().loadStore();
                    this.onResetAction();
                    this.getEditContractAction().disable();
                    this.getApproveContractAction().disable();
                },
                scope: this
            });
        }
    },


    deadManSearchAction: function(){
        this.getCreateDeathInheritance().disable();
        this.getDetailsForm().disable();
        var openingNotaryBox = this.getOpeningNotary();
        var form = this.getInheritanceSearchForm().getForm();
        var values = form.getValues();
        values.loadMode = 'from_inheritance';
        //values.tr_type_id = this.getTransactionTypeField().transactionModel.getId();
        values.tr_type_id = 80; // change
        var me = this;
        this.getInheritanceApplicationsGrid().loadStore({
            params:values,
            callback:function(records/*, operation, success*/){
                if(records)
                {
                    if(records.length == 0)
                    {
                        openingNotaryBox.hide();
                        me.getInheritanceApplicationsGrid().freeStore();
                        me.getWillsGrid().freeStore();
                        me.getInheritancesGrid().freeStore();
                    }
                    else
                    {
                        openingNotaryBox.setValue(records[0].get('opening_notary'));
                        openingNotaryBox.show();
                        if(records[0].get('opening_notary_id') == Ext.state.Manager.get('userId'))
                        {                         
                            me.getCreateDeathInheritance().enable();
                            me.onLoadWillsGridData(values);
                            me.onLoadInheritanceGridData(values);
                        }
                        else
                        {
                            me.getCreateDeathInheritance().disable();         
                            me.getInheritanceApplicationsGrid().freeStore();
                            me.getWillsGrid().freeStore();
                            me.getInheritancesGrid().freeStore();
                        }
                    }
                }
                else{
                        openingNotaryBox.hide();
                        me.getInheritanceApplicationsGrid().freeStore();
                        me.getWillsGrid().freeStore();
                        me.getInheritancesGrid().freeStore();
                }
            }
        });
    },

    onLoadWillsGridData: function(values){
        this.getWillsGrid().loadStore({
            params:{
                death_certificate: values.death_certificate,
                tr_type_id: 61 // change
            }

        });
    },
            
    onLoadInheritanceGridData: function(values){
        var me = this;
        this.getInheritancesGrid().loadStore({
            params:{
                death_certificate: values.death_certificate,
                tr_type_id: 84 // change
            },
            callback:function(records/*, operation, success*/) {
                    if(records.length != 0)
                    {
                        me.getCreateDeathInheritance().disable();
                    }
                 
            }
        });
    },

    onClickCreateDeathInheritanceAction: function(){

        var inheritor_dublicate = 0;
        this.getDetailsForm().enable();
        var me = this;       
        var full_tr_list = [];
        this.getDetailsForm().show();
        var inheritanceApplicationsGrid = this.getInheritanceApplicationsGrid();
        var willsGrid = this.getWillsGrid();
        willsGrid.getStore().each(function(record){
            full_tr_list.push(record.getId());
        });
        inheritanceApplicationsGrid.getStore().each(function(record){
            full_tr_list.push(record.getId());
        });
        
        //this.getPartiesPanel().removeAll(true);
        var panel = Ext.ComponentQuery.query('[partyTypeId]');
        for(var i=0; i < panel.length; ++i)
        {
            panel[i].freeStore();
        }
        me.getRelationshipDocumentsGrid().freeStore();
        me.getObjectsGrid().freeStore();

       

        var me = this;
        this.getWillsGrid().getStore().each(function(record){

            Ext.create('Aenis.model.workflow.Transaction', {id:record.getId()}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,' +
                            'objects,object_documents,object_document_files'
                    }
                },
                function(record, operation, success) {
                    var relationshipModel = record.relationships().first();
                    var partiesStore = relationshipModel.parties();
                    var partyTypeStore = me.getTransactionTypeField().partyTypeStore;

                    partyTypeStore.each(function(rec){
                        if(true === rec.get('is_required'))
                        {
                            

                            if(inheritor_dublicate != 0 && rec.get('party_type_id') == 30)
                            {

                            }
                            else{ 
                                //me.getPartiesPanel().down('[partyTypeId='+rec.get('party_type_id')+']').freeStore();
                                var parentPartyModel = partiesStore.findRecord('party_type_id', rec.get('parent_party_type_id'), false, false, true);
                                me.getPartiesPanel().down('[partyTypeId='+rec.get('party_type_id')+']').loadFromSubjectsStore(parentPartyModel.subjects());
                            }

                        }
                        if(rec.get('party_type_id') == 30)
                        {
                            inheritor_dublicate = inheritor_dublicate + 1;
                        }
                    });
                    me.getObjectsGrid().loadFromObjectsStore(record.relationships().first().objects());
                    me.getRelationshipDocumentsGrid().loadFromDocumentsStore(record.relationships().first().documents());
                });

        });

        this.getInheritanceApplicationsGrid().getStore().each(function(record){

            Ext.create('Aenis.model.workflow.Transaction', {id:record.getId()}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,' +
                            'objects,object_documents,object_document_files'
                    }
                },
                function(record/*, operation, success*/) {

                    var relationshipModel = record.relationships().first();
                    var partiesStore = relationshipModel.parties();
                    var partyTypeStore = me.getTransactionTypeField().partyTypeStore;

                    partyTypeStore.each(function(rec){
                        if(true === rec.get('is_required'))
                        {
                            
                            if(inheritor_dublicate != 0 && rec.get('party_type_id') == 30)
                            {

                            }
                            else{ 
                                // me.getPartiesPanel().down('[partyTypeId='+rec.get('party_type_id')+']').freeStore();
                                 var partyModel = partiesStore.findRecord('party_type_id', rec.get('party_type_id'), false, false, true);
                                 me.getPartiesPanel().down('[partyTypeId='+rec.get('party_type_id')+']').loadFromSubjectsStore(partyModel.subjects());
                            }

                            
                        }
                        if(rec.get('party_type_id') == 30)
                        {
                            inheritor_dublicate = inheritor_dublicate + 1;
                        } 
                    });
                    
                    me.getRelationshipDocumentsGrid().loadFromDocumentsStore(record.relationships().first().documents());

                });

                
        });







        /*  full_tr_list.forEach(function(tr_id){
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
                function(record, operation, success) {
                    if(operation.wasSuccessful())
                    {
                        var panel = Ext.ComponentQuery.query('[partyTypeId]', me.getPartiesPanel());

                        for(var i=0; i< panel.length; ++i)
                        {
                            panel[i].loadFromSubjectsStore();
                        }

                        me.getObjectsGrid().loadFromObjectsStore(record.relationships().first().objects());
                        me.getRelationshipDocumentsGrid().loadFromDocumentsStore(record.relationships().first().documents());

                    }
                });*/


           /* Ext.create('Aenis.model.workflow.Transaction', {id:tr_id}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,' +
                            'objects,object_documents,object_document_files',
                        lock: 1
                    }
                },
                function(record, operation, success) {
                    if(operation.wasSuccessful())
                    {
                        me.onResetAction();
                        me.getDetailsForm().transactionModel = record;

                        var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:me.getTransactionTypeField().transactionModel.getId()});

                        me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                        me.getTransactionTypeField().transactionModel = trTypeModel;
                        me.getSelectTransactionTypeAction().disable();
                        me.initWithTransactionType(trTypeModel);
                    }
                });*/


       //});




    }
});