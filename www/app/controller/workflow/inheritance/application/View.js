Ext.define("Aenis.controller.workflow.inheritance.application.View", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.inheritance.application.View'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.application.View',
        'BestSoft.mixin.Localized'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.workflow.Transaction} model
     * @return {Aenis.view.workflow.will.ApproveDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.addComponentRefs(this.oDlg);
        this.oDlg.addEvents(
            /**
             * @event approved
             * Fired when user approves warrant
             * Return FALSE from event handler to prevent dialog from closing.
             */
            'actionCompleted',

            /**
             * @event cancelled
             * Fired when user closes the dialog without any action
             */
            'cancelled'
        );
        this.oDlg.returnValue = null;
        this.oDlg.params = params || {};
        this.oDlg.control({
            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '.': {
                beforeclose: function(oDlg) {
                    if(oDlg.returnValue)
                    {
                        if(!oDlg.fireEvent('actionCompleted', oDlg.returnValue))
                        {
                            oDlg.returnValue = null;
                            return false;
                        }
                    }
                    else
                    {
                        oDlg.fireEvent('cancelled');
                    }
                    delete this.oDlg;
                    return true;
                },
                afterrender: this.afterRenderInheritanceApplicationDialog
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderInheritanceApplicationDialog: function(){
        
        var me = this;
        var inheritanceApplicationModel = this.oDlg.params.model;
        Ext.create('Aenis.model.workflow.Transaction', {id:inheritanceApplicationModel.getId()}).reload(
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
                    console.log(record.relationships().first().parties());    
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

                    var objectsPanel = me.getObjectsPanel();

                    var relationshipStore = record.relationships();

                    var cfg = {
                            xtype: 'workflowObjectSelectionGrid',
                            ref:'objectsGrid',
                            margin: '5 4',
                            resizeHandles: 'w e',
                            width: 400,
                            height:150,
                            dataType:record.getId(),
                            title: me.T('objects')
                    };
                    item = Ext.ComponentManager.create(cfg);
                    objectsPanel.add(item);
                    me.getObjectsPanel().down('[dataType='+record.getId()+']').loadFromObjectsStore(relationshipStore.first().objects());
                    me.getObjectsPanel().down('[dataType='+record.getId()+']').down('toolbar').hide();

                    var documentsPanel = me.getDocumentsPanel();
                    var cfg = {
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
                    documentsPanel.add(item);
                    me.getDocumentsPanel().down('[dataType='+record.getId()+']').loadFromDocumentsStore(relationshipStore.first().documents());
                    me.getDocumentsPanel().down('[dataType='+record.getId()+']').down('toolbar').hide();

                    Ext.resumeLayouts(true);
                });
                
    },

   

    onclickCloseBtn: function() {
        this.oDlg.close();
    }
});

