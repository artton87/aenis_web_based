Ext.require([
    'Aenis.view.workflow.party.right.type.components.TypesGrid',
    'Aenis.store.workflow.party.right.Types'
]);

Ext.define('Aenis.view.workflow.party.right.type.SelectDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.workflowPartyRightTypeSelectDlg',

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
        'Locale.hy_AM.workflow.party.right.type.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'workflowPartyRightTypesGrid',
                    ref: 'typesGrid',
                    //selType: 'rowmodel',
                    selType: 'checkboxmodel',
                    selModel: {
                        mode: "MULTI"
                    },
                    border: false,
                    autoLoadStore: false,
                    tools: [],
                    store: Ext.create('Aenis.store.workflow.party.right.Types')
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
