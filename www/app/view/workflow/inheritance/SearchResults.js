Ext.require([
    'Ext.form.FieldSet',
    'Aenis.view.workflow.inheritance.components.Grid',
	'Aenis.view.main.contact.components.SelectionGrid',
	'Aenis.view.workflow.object.components.SelectionGrid',
	'Aenis.view.workflow.file.components.SelectionGrid'
]);

Ext.define('Aenis.view.workflow.inheritance.SearchResults', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowInheritanceSearchResults',

    allowMultipleInstances: true,

    layout:{
      type:'vbox',
      align:'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.SearchResults',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var store = Ext.create('Aenis.store.workflow.Inheritances');
        Ext.apply(this, {
            tabConfig: {
                title: this.T("inheritance_search_results")
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
                    xtype: 'workflowInheritanceGrid',
                    autoHeight: true,
                    autoLoadStore:false,
                    ref: 'inheritanceSearchGrid',
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
					ref:'inheritanceContentPanel',
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
							ref:'inheritanceContentPartiesPanel',
							layout:{
								type:'hbox',
								align:'center',
								pack:'center'
							},
							//height:300,
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
									ref:'inheritanceContentObjectsPanel',
									layout:{
										type:'hbox'
									},
									items:[]
								},
								{
									xtype:'container',
									ref:'inheritanceContentDocumentsPanel',
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
