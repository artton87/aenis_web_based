Ext.require([
    'Ext.form.FieldSet',
    'Aenis.view.workflow.warrant.components.Grid',
	'Aenis.view.main.contact.components.SelectionGrid',
	'Aenis.view.workflow.object.components.SelectionGrid',
	'Aenis.view.workflow.file.components.SelectionGrid'
]);

Ext.define('Aenis.view.workflow.warrant.SearchResults', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowWarrantSearchResults',

    allowMultipleInstances: true,

    layout:{
      type:'vbox',
      align:'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.warrant.SearchResults',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var store = Ext.create('Aenis.store.workflow.Warrants');
        Ext.apply(this, {
            tabConfig: {
                title: this.T("warrant_search_results")
            },
            ref: 'tabView',
            tpl: [
                '<p>warrant_code: {params.warrant_code}</p>'
            ],
            items: [
                {
                    region: 'center',
                    xtype: 'workflowWarrantGrid',
                    autoHeight: true,
                    autoLoadStore:false,
                    ref: 'warrantSearchGrid',
                    title: this.T("search_results"),
					height: 200,
                    flex: 1
                },
				{
					xtype:'container',
					ref:'warrantContentPanel',
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
							ref:'warrantContentPartiesPanel',
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
									ref:'warrantContentObjectsPanel',
									layout:{
										type:'hbox'
									},
									items:[]
								},
								{
									xtype:'container',
									ref:'warrantContentDocumentsPanel',
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
