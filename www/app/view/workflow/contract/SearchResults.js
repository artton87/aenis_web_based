Ext.require([
    'Ext.form.FieldSet',
    'Aenis.view.workflow.contract.components.Grid',
	'Aenis.view.main.contact.components.SelectionGrid',
	'Aenis.view.workflow.object.components.SelectionGrid',
	'Aenis.view.workflow.file.components.SelectionGrid'
]);

Ext.define('Aenis.view.workflow.contract.SearchResults', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowContractSearchResults',

    allowMultipleInstances: true,

    layout:{
      type:'vbox',
      align:'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.contract.SearchResults',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var store = Ext.create('Aenis.store.workflow.Contracts');
        Ext.apply(this, {
            tabConfig: {
                title: this.T("contract_search_results")
            },
            ref: 'tabView',
			layout:{
				type:'vbox',
				align:'stretch',
				pack: 'end'
			},
			autoScroll: true,
            items: [
                {
                    region: 'center',
                    xtype: 'workflowContractGrid',
                    //autoHeight: true,
                    autoLoadStore:false,
                    ref: 'contractSearchGrid',
                    title: this.T("search_results"),
					height: 200,
					flex: 1
                    /*bbar:
                        {
                            xtype: 'pagingtoolbar',
                            dock:'top',
                            store: store,
                            displayInfo: true,
                            displayMsg: this.T('displayMessage'),
                            emptyMsg: this.T('noResult')
                        }*/
                },
                {
                    xtype:'container',
					ref:'contractContentPanel',
					resizable: true,
					autoScroll: true,
					height: 300,
                    defaults:{
                        margin: '20px 5px'
                    },
                    items:[
						{
							xtype:'fieldset',
							title: this.T('parties'),
							ref:'contractContentPartiesPanel',
							layout:{
								type:'hbox',
								align:'center',
								pack:'center'
							},
							height:300,
							margin:'0 0 10 0',
							autoScroll: true,
							items:[]
						},
						{
							xtype:'fieldset',
							title: this.T('object_documents'),
							layout:{
								type:'hbox',
								align:'center',
								pack:'center'
							},
							items:[
								{
									xtype:'container',
									ref:'contractContentObjectsPanel',
									layout:{
										type:'hbox'
									},
									items:[]
								},
								{
									xtype:'container',
									ref:'contractContentDocumentsPanel',
									layout:{
										type:'hbox'
									},
									items:[]
								}
							]
						}

					]
                }
            ]
        });
        this.callParent(arguments);
    }


});
