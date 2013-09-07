Ext.define('Aenis.controller.workflow.inheritance.SearchResults', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.inheritance.SearchResults'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.SearchResults',
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
                '[ref=inheritanceSearchGrid]':{
                   selectionchange: this.onclickSelectionGrid
                },
                '[ref=dataItem]':{

                }
            }, null, this)
        });
    },

    onAfterRenderTabView: function(oView) {
        var view = this.getTabView(oView);
        this.getInheritanceSearchGrid(oView).loadStore({
            params: view.params
         });
    },


	onclickSelectionGrid: function(selection){

		var me = this;

		var selectionModel = this.getInheritanceSearchGrid(selection.view).getSelectionModel().getSelection();
		if(selectionModel.length > 0)
		{
			me.onclickResetInheritanceContentPanelFormBtn(selection.view);
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
						me.getInheritanceSearchGrid(selection.view).transactionModel = record;
						Ext.suspendLayouts();
						var partiesPanel = me.getInheritanceContentPartiesPanel(selection.view);
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

							me.getInheritanceContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').loadFromSubjectsStore(record.subjects());
							me.getInheritanceContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').down('toolbar').hide();
						});

						var objectsPanel = me.getInheritanceContentObjectsPanel(selection.view);

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
						me.getInheritanceContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromObjectsStore(relationshipStore.first().objects());
						me.getInheritanceContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();

						var documentsPanel = me.getInheritanceContentDocumentsPanel(selection.view);
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
						me.getInheritanceContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromDocumentsStore(relationshipStore.first().documents());
						me.getInheritanceContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();

						Ext.resumeLayouts(true);
					}
				});
		}
	},


	onclickResetInheritanceContentPanelFormBtn: function(oView){
		this.getInheritanceContentPartiesPanel(oView).removeAll(true);
		this.getInheritanceContentObjectsPanel(oView).removeAll(true);
		this.getInheritanceContentDocumentsPanel(oView).removeAll(true);
	}


});
