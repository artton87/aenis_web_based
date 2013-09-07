Ext.require([
    'Aenis.view.main.country.region.community.components.CommunitiesGrid',
    'Aenis.store.main.country.region.Communities'
]);

Ext.define('Aenis.view.main.country.region.community.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainCountryRegionCommunitySelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: {
        type: 'fit'
    },
    minButtonWidth: 30,
    width: 480,
    height: 400,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.country.region.community.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            title: this.T('windowTitle'),
            items: [
                {
                    xtype: 'mainCountryRegionCommunitiesGrid',
                    ref: 'communitiesGrid',
                    border: false,
                    tools: [],
                    store: Ext.create('Aenis.store.main.country.region.Communities')
                }
            ],
            buttons: [
                {
                    text: this.T('select'),
                    ref: 'acceptAction',
                    iconCls: 'icon-ok',
                    disabled: true
                },
                {
                    text: this.T('close'),
                    action: 'cancel',
                    iconCls: 'icon-cancel'
                }
            ]
        });
    	this.callParent(arguments);
    }
});
