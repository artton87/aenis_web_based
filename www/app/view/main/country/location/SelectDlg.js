Ext.require([
    'BestSoft.tree.Panel',
    'Aenis.view.main.country.location.components.LocationsTree'
]);

Ext.define('Aenis.view.main.country.location.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainCountryLocationSelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: 'fit',
    minButtonWidth: 30,
    width: 480,
    height: 450,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.country.location.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'mainCountryLocationsTree',
                    ref: 'locationsTree',
                    animate: false,
                    store: Ext.create('Aenis.store.main.country.Locations')
                }
            ],
            buttons: [
                {
                    text: me.T('select'),
                    ref: 'acceptAction',
                    iconCls: 'icon-ok',
                    disabled: true
                },
                {
                    text: me.T('close'),
                    action: 'cancel',
                    iconCls: 'icon-cancel'
                }
            ]
        });
    	this.callParent(arguments);
    }
});
