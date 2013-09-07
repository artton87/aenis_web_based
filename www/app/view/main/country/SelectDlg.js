Ext.require([
    'Aenis.view.main.country.components.CountriesGrid',
    'Aenis.store.main.Countries'
]);

Ext.define('Aenis.view.main.country.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainCountrySelectDlg',

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
        'Locale.hy_AM.main.country.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'mainCountriesGrid',
                    ref: 'countriesGrid',
                    border: false,
                    autoLoadStore: false,
                    tools: [],
                    store: Ext.create('Aenis.store.main.Countries')
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
