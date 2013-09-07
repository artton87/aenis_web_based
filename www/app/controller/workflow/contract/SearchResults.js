Ext.define('Aenis.controller.workflow.contract.SearchResults', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.contract.SearchResults'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.contract.SearchResults',
        'BestSoft.mixin.Localized'
    ],

    openTab: function(params) {
        this.application.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
			var me = this;
            oView.params = params || {};
            oView.control({
                '.': {
                    afterrender: {fn: me.onAfterRenderTabView, single: true}
                },
                '[ref=contractSearchGrid]':{
                   selectionchange: this.onclickSelectionGrid
                },
                '[ref=dataItem]':{

                }
            }, null, this)
        });
    },

    onAfterRenderTabView: function(oView) {
        var view = this.getTabView(oView);
        this.getContractSearchGrid(oView).loadStore({
            params: view.params
         });
    },


	onclickSelectionGrid: function(selection){

		var me = this;

		var selectionModel = this.getContractSearchGrid(selection.view).getSelectionModel().getSelection();
		if(selectionModel.length > 0)
		{
			me.onclickResetContractContentPanelFormBtn(selection.view);
			Ext.create('Aenis.model.workflow.Transaction',{id:selectionModel[0].getId()}).reload(
				{
					params: {
						info: 'relationships,relationship_documents,relationship_document_files,' +
							'parties,' +
							'subjects,subject_documents,subject_document_files,' +
							'objects,object_documents,object_document_files'
					}
				},
				function(record, operation/*, success*/){

					if(operation.wasSuccessful())
					{
						me.getContractSearchGrid(selection.view).transactionModel = record;
						Ext.suspendLayouts();
						var partiesPanel = me.getContractContentPartiesPanel(selection.view);
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

							me.getContractContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').loadFromSubjectsStore(record.subjects());
							me.getContractContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').down('toolbar').hide();
						});

						var objectsPanel = me.getContractContentObjectsPanel(selection.view);

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
						me.getContractContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromObjectsStore(relationshipStore.first().objects());
						me.getContractContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();

						var documentsPanel = me.getContractContentDocumentsPanel(selection.view);
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
						me.getContractContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromDocumentsStore(relationshipStore.first().documents());
						me.getContractContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();

						Ext.resumeLayouts(true);
					}
				});
		}
	},


	onclickResetContractContentPanelFormBtn: function(oView){
		this.getContractContentPartiesPanel(oView).removeAll(true);
		this.getContractContentObjectsPanel(oView).removeAll(true);
		this.getContractContentDocumentsPanel(oView).removeAll(true);
	}


});
