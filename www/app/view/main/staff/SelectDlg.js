Ext.require([
    'Aenis.view.main.staff.components.Tree'
]);

Ext.define('Aenis.view.main.staff.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainStaffSelectDlg',

    closeAction: 'destroy',
    modal: true,
    layout: 'fit',
    border: false,
    minButtonWidth: 30,
    width: 480,
    height: 450,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.staff.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'main.staff.Tree',
                    ref: 'itemsTree',
                    autoLoadStore: false,
                    rootVisible: false,
                    animate: false,
                    store: Ext.create('Aenis.store.main.Staffs')
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
