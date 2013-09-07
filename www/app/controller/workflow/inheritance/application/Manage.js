Ext.define('Aenis.controller.workflow.inheritance.application.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.inheritance.application.Manage',
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
                '[ref=warrantsGrid]': {
                    selectionchange: this.onSelectionChangeWarrantsGrid
                },
                '[action=create_party_by_type]': {
                    click: this.onCreatePartyByTypeAction
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
                '[ref=saveAction]': {
                    click: {fn: this.onSaveAction, buffer:BestSoft.eventDelay}
                },
                '[ref=editAction]': {
                    click: {fn: this.onEditAction, buffer:BestSoft.eventDelay}
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
                '[ref=checkboxAddress]':{
                    change:this.changeCheckboxAddressAction
                },
                '[ref=detailsForm]': {
                    afterrender: this.onAfterRenderDetailsForm,
                    beforeaction: this.onFormBeforeAction,
                    actioncomplete: this.onFormActionComplete,
                    actionfailed: this.onFormActionFailed
                },
                '[ref=isPayedAction]':{
                    click: this.onClickIsPayedAction
                },

                '.':{
                    afterrender: this.onAfterRenderAction
                }
            }, null, this);

        });
    },



    changeCheckboxAddressAction: function(){

        var me = this;
        var checkboxVal = this.getCheckboxAddress().getValue();

        if(false === checkboxVal)
        {
            var me = this;
            var oController = this.application.loadController('workflow.inheritance.application.OpenNotarySelectDlg');
            oController.showDialog().on({
                itemSelected: function(model) {
                    me.getOpeningNotary().setValue('<b>'+model.notary.get('user_full_name')+'</b>');
                    me.getOpeningNotary().openingNotaryId = model.notary_id;
                    me.getOpeningNotary().show();
                    me.getTestatorResidenceAddress().show();
                    me.getTestatorResidenceAddress().setValue(model.address);
                    me.getTestatorResidenceAddress().address = model.address;
                    me.getCheckboxTestatorAddress().hide();
                },
                scope: this
            });
        }
    },


    onAfterRenderAction: function(){

    },

    onClickIsPayedAction: function(){
        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
        var me=this;
        if(selection.length > 0)
        {
            Ext.Ajax.request({
                url: 'workflow/transaction/is_paid.php',
                method: 'POST',
                params: {
                    transaction_id: selection.getId()
                },
                callback: function(options, success, response) {
                    if(me.application.handleAjaxResponse(response))
                    {
                        response = Ext.JSON.decode(response.responseText);
                        if(response.success)
                        {
                            selection[0].set('is_paid',1);
                            selection[0].commit();
                        }
                    }
                }
            });
        }
    },


    onAfterRenderDocContentEditor: function(editor) {
        editor.setVariableSubstituteConfig({
            scope: this,
            fn: this.variableSubstituteFn
        });
    },

    onclickViewCompleteAction: function(){
        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
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
                    var oController = me.application.loadController('Aenis.controller.workflow.document.ViewDlg');
                    oController.showDialog({docModel:docModel});
                }
            );
        }
    },

    onclickViewActionBtn: function(){
        this.getViewCompleteAction().show();

        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var me = this,
                transactionId = selection[0].get('id');
            Ext.create('Aenis.model.workflow.Transaction', {id:transactionId}).reload(
                {
                    params: {
                        info: 'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,'
                    }
                },
                function(record, operation/*, success*/) {
                    if(operation.wasSuccessful())
                    {

                        me.getSaveAction().disable();
                        me.getAddAction().disable();
                        me.getDetailsForm().transactionModel = record;

                        var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:selection[0].get('tr_type_id')});

                        me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                        me.getTransactionTypeField().transactionModel = trTypeModel;
                        me.getSelectTransactionTypeAction().disable();
                        var panels = Ext.ComponentQuery.query("[partyTypeId]", me.getPartiesPanel());
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
            if(oPartyGrid)
            {
                var subjects = oPartyGrid.getStore().getFieldData('contactName');
                console.log(subjects);
                return subjects.join(', ');
            }
        }
        return null;
    },

    onClickSelectTransactionType: function() {
        var oController = this.application.loadController('workflow.transaction.type.SelectDlg');
        oController.showDialog({uiType: 'inheritance_application'}).on({
            itemSelected: function(model) {
                this.getTransactionTypeField().setValue(model.getTitle());
                this.getTransactionTypeField().transactionModel = model;
                this.initWithTransactionType(model);
                this.getCheckboxTestatorAddress().show();
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
        }
        this.getDetailsForm().getForm().reset();
        this.getRelationshipDocumentsGrid().freeStore();
        this.getSaveAction().disable();
        this.getAddAction().enable();
        this.getViewAction().hide();
        this.getViewCompleteAction().hide();

        this.getOpeningNotary().setValue('');
        this.getOpeningNotary().hide();
        this.getTestatorResidenceAddress().hide();
        this.getTestatorResidenceAddress().setValue('');
        this.getCheckboxTestatorAddress().show();


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

        var data = {
            notary_id: parseInt(this.getNotariesCombo().getValue()),
            tr_type_id: this.getTransactionTypeField().transactionModel.getId(),
            parties: []
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

            if(oPanel.getSubjectRecords()[0].serviceData.death_certificate != '')
            {
                var death_certificate = oPanel.getSubjectRecords()[0].serviceData.death_certificate;
            }

            data.parties.push({
                party_type_id: oPanel.partyTypeId,
                party_type_code: oPanel.partyTypeCode,
                data: oPanel.getSubjectRecords()
            });
        }


        //collect relationship documents
        if(!this.getRelationshipDocumentsGrid().isValid()) //relationship document list may contain invalid records
        {
            Ext.Msg.alert(this.application.title, oFormCmp.messages["relationship_documents_invalid"]);
            return false;
        }
        data.relationship_documents = this.getRelationshipDocumentsGrid().getFileRecords();

        data.opening_notary_id = this.getOpeningNotary().openingNotaryId;

        data.testatorAddress = this.getTestatorResidenceAddress().address;

        data.death_certificate = death_certificate;

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
            this.getWarrantsGrid().getStore().reload();
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

            this.getRelationshipDocumentsGrid().resetFileFields();
        }
    },


    onAfterRenderDetailsForm: function(oForm) {
        oForm.loadingProgressStore.on('add', this.onAddDetailsFormLoadingProgressStore, this);
    },


    onAddDetailsFormLoadingProgressStore: function(loadingProgressStore) {
        var shouldBeLoaded = ['parties'];
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


            //load properties
            var propertiesStore = transactionModel.properties();
            propertiesStore.each(function(propertyModel) {
                var propertyTypeId = propertyModel.getId();
                var el = oForm.down("[propertyTypeId="+propertyTypeId+"]");
                if(el)
                {
                    el.setValue(propertyModel.get('value'));
                }
            }, this);

            //we finished adding party components for each needed type, now filter party types store
            this.filterPartyTypesStore();

            //load relationship documents
            this.getRelationshipDocumentsGrid().loadFromDocumentsStore(relModel.documents()); //load documents into panel

            //????Will change????
            var panel = this.getPartiesPanel().down('[partyTypeId=30]');
            if(panel.getSubjectRecords()[0].serviceData.death_certificate != '')
            {
                var place_of_residence = panel.getSubjectRecords()[0].serviceData.place_of_residence;

            }
            this.getTestatorResidenceAddress().setValue(place_of_residence);
            this.getTestatorResidenceAddress().show();
        }
    },


    onEditAction: function() {

        var oGrid = this.getWarrantsGrid();
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
                            'subjects,subject_documents,subject_document_files',
                        lock: 1
                    }
                },
                function(record, operation/*, success*/) {
                    if(operation.wasSuccessful())
                    {
                        me.onResetAction();
                        var loggedInUserId = Ext.state.Manager.get('userId');
                        var lockedUserId = record.get('locked_user_id');
                        if(loggedInUserId == lockedUserId) //we locked successfully
                        {
                            me.getSaveAction().enable();
                            me.getAddAction().disable();

                            me.getDetailsForm().transactionModel = record;

                            var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:selection[0].get('tr_type_id')});

                            me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                            me.getTransactionTypeField().transactionModel = trTypeModel;
                            me.getSelectTransactionTypeAction().disable();
                            me.initWithTransactionType(trTypeModel);
                           console.log(record.properties());


                            me.getOpeningNotary().setValue('<b>'+selection[0].get('opening_notary')+'</b>');
                           // me.getOpeningNotary().openingNotaryId = model.notary_id;
                            me.getOpeningNotary().show();
                            //me.getTestatorResidenceAddress().show();
                           // me.getTestatorResidenceAddress().setValue(model.address);
                          //  me.getTestatorResidenceAddress().address = model.address;
                            me.getCheckboxTestatorAddress().hide();

                        }
                        else
                        {
                            Ext.Msg.alert(
                                me.application.title,
                                Ext.String.format(
                                    oGrid.messages["locked_by_user"],
                                    record.get('locked_user')
                                )
                            );
                        }

                        selection[0].set('locked_user_id', lockedUserId);
                        selection[0].commit();
                    }
                }
            );



        }
    },


    onUnlockAction: function() {
        var oGrid = this.getWarrantsGrid();
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
                            me.onUnlockActionUpdateControls();
                            me.getDetailsForm().transactionModel = null;
                            me.resetTransactionType();
                        }
                    }
                }
            });
        }
    },

    onUnlockActionUpdateControls: function() {
        this.getWarrantsGrid().enable();
        this.getSaveAction().disable();
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

    },


    partyTypesStoreLoaded: function(partyTypesStore) {
        this.createPartyPanels(partyTypesStore);
        this.getDetailsForm().loadingProgressStore.add({loaded_item: 'parties'});
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
                validateSelection: {fn: this.onValidateContactSelection, scope: this},
                afterContactRequested: {fn: this.onAfterContactRequested, scope: this}
            }
        });
        var partyCmp = Ext.ComponentManager.create(partyCmpCfg);
        partiesPanel.add(partyCmp);
        return partyCmp;
    },

    /**
     * after contact requested
     * @param oGrid
     * @param mode
     * @param newRecord
     */
    onAfterContactRequested: function(oGrid, mode, newRecord){
        var subjectsData = oGrid.getSubjectRecords();


        var death_certificate = subjectsData[0].serviceData.death_certificate;

        this.getTestatorResidenceAddress().death_certificate = death_certificate;

        var me = this;
        Ext.Ajax.request({
            url: 'workflow/inheritance/application/openingNotary.php',
            method: 'POST',
            params: {
                init: 1,
                death_certificate: death_certificate
            },
            callback: function(options, success, response) {
                if(Aenis.application.handleAjaxResponse(response))
                {
                    response = Ext.JSON.decode(response.responseText);
                    if(response.success && response.data)
                    {
                        me.getOpeningNotary().setValue('<b>'+response.data.notary_full_name+'</b>');
                        me.getOpeningNotary().openingNotaryId = response.data.id;
                        me.getOpeningNotary().show();
                        me.getTestatorResidenceAddress().show();
                        me.getTestatorResidenceAddress().setValue(response.data.residence_address);
                        me.getCheckboxTestatorAddress().hide();
                    }
                }
            }
        });
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


    onSelectionChangeWarrantsGrid: function(selModel, selected) {
        this.getEditAction().disable();
        this.getApproveAction().disable();
        this.getTerminateAction().disable();
        if(selected.length > 0)
        {

            if(selected[0].get('tr_status_code') == 'approved')
            {
                this.getTerminateAction().enable();
                this.getViewAction().show();
                this.getEditAction().disable();
            }
            else
            {
                this.getEditAction().enable();
            }
            if(selected[0].get('locked_user_id') > 0)
            {

            }
            else
            {
                if(selected[0].get('tr_status_code') != 'approved')
                {
                    this.getApproveAction().enable();
                }

            }
        }
    },

    onClickApproveAction: function(){
        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            console.log(selection[0]);
            var oController = this.application.loadController('workflow.inheritance.application.ApproveDlg');
            oController.showDialog({model:selection[0]}).on({
                actionCompleted: function() {
                    this.getWarrantsGrid().loadStore();
                    this.onResetAction();
                    this.getEditAction().disable();
                    this.getApproveAction().disable();
                },
                scope: this
            });
        }
    }

});
