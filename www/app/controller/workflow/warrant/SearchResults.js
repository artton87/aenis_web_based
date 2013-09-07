Ext.define('Aenis.controller.workflow.warrant.SearchResults', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.warrant.SearchResults'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.warrant.SearchResults',
        'BestSoft.mixin.Localized'
    ],

    openTab: function(params) {
        this.application.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.params = params || {};
            oView.control({
                '.': {
                    afterrender: {fn: this.onAfterRenderTabView, single: true}
                },
                '[ref=warrantSearchGrid]':{
                    selectionchange: this.onclickSelectionGrid
                },
                '[ref=dataItem]':{

                }
            }, null, this)
        });
    },

    onAfterRenderTabView: function(oView) {
        var view = this.getTabView(oView);
        this.getWarrantSearchGrid(oView).loadStore({
            params: view.params
         });

       // this.getWarrantContentView(oView).hide();
    },

	/*
    onclickWarrantSelection: function(selection){

        this.getWarrantContentView(selection.view).show();

        var selectionModel = this.getWarrantSearchGrid(selection.view).getSelectionModel().getSelection();
        var me = this;
        Ext.suspendLayouts();
        Ext.create('Aenis.model.workflow.Transaction',{id:selectionModel[0].getId()}).reload(
            {
                params: {
                    info: 'properties,' +
                        'relationships,relationship_documents,relationship_document_files,' +
                        'parties,party_rights,' +
                        'subjects,subject_properties,subject_documents,subject_document_files,' +
                        'objects,object_documents,object_document_files'
                }
            },
            function(record, operation){
                if(operation.wasSuccessful())
                {



                    var relationshipStore = record.relationships();
                    var partyStore = relationshipStore.first().parties();

                    var item;
                    var principalsPanel = me.getPrincipalsPanel(selection.view);
                    var principalStore = partyStore.findRecord('party_type_code','principal', 0, false, false, true).subjects();
                    principalStore.each(function(record){
                        var cfg = {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox'
                            },
                            ref:'dataItem',
                            defaultType: 'displayfield',
                            defaults:{
                                margin:'0px 10px 0px 0px'
                            },
                            items:[
                                {
                                    xtype:'button',
                                    tooltip: me.T('view'),
                                    iconCls: 'icon-view',
                                    type:'subject',
                                    model: record,
                                    listeners:{
                                        click: {fn:me.onclickViewContent, scope: me}
                                    },
                                    ui: 'default-toolbar-small'
                                },
                                {
                                    value: record.get('contact_name')
                                }
                            ]
                        };
                        item = Ext.ComponentManager.create(cfg);
                        principalsPanel.add(item);
                    });

                    var agentsPanel = me.getAgentsPanel(selection.view);
                    var agentStore = partyStore.findRecord('party_type_code','agent', 0, false, false, true).subjects();
                    agentStore.each(function(record){
                        var cfg = {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox'
                            },
                            defaultType: 'displayfield',
                            defaults:{
                                margin:'0px 10px 0px 0px'
                            },
                            items:[
                                {
                                    xtype:'button',
                                    tooltip: me.T('view'),
                                    iconCls: 'icon-view',
                                    type:'subject',
                                    model: record,
                                    listeners:{
                                        click: {fn:me.onclickViewContent, scope: me}
                                    },
                                    ui: 'default-toolbar-small'
                                },
                                {
                                    value: record.get('contact_name'),
                                    flex: 1
                                }
                            ]
                        };
                        item = Ext.ComponentManager.create(cfg);
                        agentsPanel.add(item);
                    });

                    var objectsPanel = me.getObjectsPanel(selection.view);
                    var objectStore = relationshipStore.first().objects();
                    objectStore.each(function(record){
                        var cfg = {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox'
                            },
                            defaultType: 'displayfield',
                            defaults:{
                                margin:'0px 10px 0px 0px'
                            },
                            items:[
                                {
                                    xtype:'button',
                                    tooltip: me.T('view'),
                                    iconCls: 'icon-view',
                                    type:'object',
                                    model: record,
                                    listeners:{
                                        click: {fn:me.onclickViewContent, scope: me}
                                    },
                                    ui: 'default-toolbar-small'
                                },
                                {
                                    value: record.get('objectName'),
                                    flex: 1
                                }
                            ]
                        };
                        item = Ext.ComponentManager.create(cfg);
                        objectsPanel.add(item);
                    });

                    var documentsPanel = me.getDocumentsPanel(selection.view);
                    var documentStore = relationshipStore.first().documents();
                    documentStore.each(function(record){

                            var cfg = {
                                xtype:'fieldcontainer',
                                layout:{
                                    type:'hbox'
                                },
                                defaultType: 'displayfield',
                                defaults:{
                                    margin:'0px 10px 0px 0px'
                                },
                                items:[
                                    {
                                        xtype:'button',
                                        tooltip: me.T('view'),
                                        iconCls: 'icon-view',
                                        type:'document',
                                        model: record,
                                        listeners:{
                                            click: {fn:me.onclickViewContent, scope: me}
                                        },
                                        ui: 'default-toolbar-small'
                                    },
                                    {
                                        value: record.get('doc_type_label'),
                                        flex: 1
                                    }
                                ]
                            };

                            item = Ext.ComponentManager.create(cfg);
                            documentsPanel.add(item);
                    });

                    console.log(agentStore.first());

                    var rightsPanel = me.getRightsPanel(selection.view);
                    var rightStore = agentStore.first().rights();
                    console.log(agentStore.first());
                    rightStore.each(function(record){
                        var cfg = {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox'
                            },
                            defaultType: 'displayfield',
                            defaults:{
                                margin:'0px 10px 0px 0px'
                            },
                            items:[
                                {
                                    value: record.get('label'),
                                    flex: 1
                                }
                            ]
                        };

                        item = Ext.ComponentManager.create(cfg);
                        rightsPanel.add(item);
                    });

                    var propertiesPanel = me.getAttributesPanel(selection.view);
                    var propertyStore = record.properties();
                    propertyStore.each(function(record){

                        var cfg = {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox'
                            },
                            defaultType: 'displayfield',
                            defaults:{
                                margin:'0px 10px 0px 0px'
                            },
                            items:[
                                {
                                    value: record.get('label'),
                                    flex: 1
                                }
                            ]
                        };

                        item = Ext.ComponentManager.create(cfg);
                        propertiesPanel.add(item);

                    });







                }
            });
        Ext.resumeLayouts(true);

    },
	*/

	/*
    onclickViewContent: function(oBtn){
        var oController;
        if(oBtn.type == 'subject')
        {
            oController = this.application.loadController('Aenis.controller.main.contact.'+oBtn.model.get('contact_type')+'.ViewDlg');
            oController.showDialog({subjectModel:oBtn.model});
        }
        else if(oBtn.type == 'object')
        {
            oController = this.application.loadController('Aenis.controller.main.'+oBtn.model.get('objectType')+'.ViewDlg');
            oController.showDialog({objectModel:oBtn.model});
        }
        else if(oBtn.type == 'document')
        {
            oController = this.application.loadController('Aenis.controller.workflow.document.ViewDlg');
            oController.showDialog({docModel:oBtn.model});
        }
        else if(oBtn.type == 'right')
        {
            oController = this.application.loadController('Aenis.controller.worflow.party.right.ViewDlg');
            oController.showDialog({params:oBtn.model});
        }
        else if(oBtn.type == 'attribute')
        {
            oController = this.application.loadController('Aenis.controller.workflow.transaction.PropertiesDlg');
            oController.showDialog({params:oBtn.model});
        }
    }
	*/

	onclickSelectionGrid: function(selection){

		var me = this;

		var selectionModel = this.getWarrantSearchGrid(selection.view).getSelectionModel().getSelection();
		if(selectionModel.length > 0)
		{
			me.onclickResetWarrantContentPanelFormBtn(selection.view);
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
						me.getWarrantSearchGrid(selection.view).transactionModel = record;
						Ext.suspendLayouts();
						var partiesPanel = me.getWarrantContentPartiesPanel(selection.view);
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

							me.getWarrantContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').loadFromSubjectsStore(record.subjects());
							me.getWarrantContentPartiesPanel(selection.view).down('[partyTypeCode='+record.get('party_type_code')+']').down('toolbar').hide();
						});

						var objectsPanel = me.getWarrantContentObjectsPanel(selection.view);

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
						me.getWarrantContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromObjectsStore(relationshipStore.first().objects());

						me.getWarrantContentObjectsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();
						var documentsPanel = me.getWarrantContentDocumentsPanel(selection.view);
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
						me.getWarrantContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').loadFromDocumentsStore(relationshipStore.first().documents());

						me.getWarrantContentDocumentsPanel(selection.view).down('[dataType='+record.getId()+']').down('toolbar').hide();
						Ext.resumeLayouts(true);
					}
				});
		}
	},


	onclickResetWarrantContentPanelFormBtn: function(oView){
		this.getWarrantContentPartiesPanel(oView).removeAll(true);
		this.getWarrantContentObjectsPanel(oView).removeAll(true);
		this.getWarrantContentDocumentsPanel(oView).removeAll(true);
	}

});
