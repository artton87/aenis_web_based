Ext.require([
    'Ext.form.FieldSet',
    'Aenis.view.workflow.will.components.Grid',
	'Aenis.view.main.contact.components.SelectionGrid',
	'Aenis.view.workflow.object.components.SelectionGrid',
	'Aenis.view.workflow.file.components.SelectionGrid'
]);

Ext.define('Aenis.view.workflow.will.SearchResults', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowWillSearchResults',

    allowMultipleInstances: true,

    layout:{
      type:'vbox',
      align:'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.will.SearchResults',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var store = Ext.create('Aenis.store.workflow.Wills');
        Ext.apply(this, {
            tabConfig: {
                title: this.T("will_search_results")
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
                    xtype: 'workflowWillGrid',
                    autoHeight: true,
                    autoLoadStore:false,
                    ref: 'willSearchGrid',
                    title: this.T("search_results"),
                    flex: 1,
					height: 200
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
					ref:'willContentPanel',
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
							ref:'willContentPartiesPanel',
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
									ref:'willContentObjectsPanel',
									layout:{
										type:'hbox'
									},
									items:[]
								},
								{
									xtype:'container',
									ref:'willContentDocumentsPanel',
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
