Ext.require([
    'Aenis.view.main.role.components.RolesGrid',
    'Aenis.store.main.Roles'
]);

Ext.define('Aenis.view.main.role.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainRoleSelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: {
        type: 'fit'
    },
    minButtonWidth: 30,
    width: 400,
    height: 300,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.role.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'mainRolesGrid',
                    ref: 'itemsGrid',
                    hideHeaders: true,
                    border: false,
                    tools: [],
                    store: Ext.create('Aenis.store.main.Roles')
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
