Ext.define('Aenis.controller.workflow.will.SearchResults', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.will.SearchResults'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.will.SearchResults',
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
                '[ref=willSearchGrid]':{
                   selectionchange: this.onclickSelectionGrid
                },
                '[ref=dataItem]':{

                }
            }, null, this)
        });
    },

    onAfterRenderTabView: function(oView) {
        var view = this.getTabView(oView);
        this.getWillSearchGrid(oView).loadStore({
            params: view.params
         });
    },


	onclickSelectionGrid: function(selection){

		var me = this;

		var selectionModel = this.getWillSearchGrid(selection.view).getSelectionModel().getSelection();
		if(selectionModel.length > 0)
		{
			me.onclickResetWillContentPanelFormBtn(selection.view);
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
						me.getWillSearchGrid(selection.view).transactionModel = record;
						Ext.suspendLayouts();
						var partiesPanel = me.getWillContentPartiesPanel(selection.view);
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

							me.getWillContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').loadFromSubjectsStore(record.subjects());
							me.getWillContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').down('toolbar').hide();
						});

						var objectsPanel = me.getWillContentObjectsPanel(selection.view);

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
						me.getWillContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromObjectsStore(relationshipStore.first().objects());
						me.getWillContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();

						var documentsPanel = me.getWillContentDocumentsPanel(selection.view);
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
						me.getWillContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromDocumentsStore(relationshipStore.first().documents());
						me.getWillContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();

						Ext.resumeLayouts(true);
					}
				});
		}
	},


	onclickResetWillContentPanelFormBtn: function(oView){
		this.getWillContentPartiesPanel(oView).removeAll(true);
		this.getWillContentObjectsPanel(oView).removeAll(true);
		this.getWillContentDocumentsPanel(oView).removeAll(true);
	}


});
