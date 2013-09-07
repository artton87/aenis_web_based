Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.form.FieldContainer',
    'Ext.ux.grid.FiltersFeature',
    'Ext.ux.CheckColumn',
    'Ext.layout.container.Border',
    'Aenis.view.main.user.components.Grid',
    'Aenis.view.sysadmin.resource.components.SelectorGrid'
]);

Ext.define('Aenis.view.main.user.Resources', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainUserResources',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.user.Resources',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.ShowConditionalElements'
    ],

    initComponent: function() {
        var userResourcesStore = Ext.create('Aenis.store.main.user.Resources');
        userResourcesStore.loadData([]);
        Ext.apply(this, {
            tabConfig: {
                title: this.T("tabTitle")
            },
            items: [
                {
                    xtype: 'main.user.Grid',
                    ref: 'usersGrid',
                    width: '30%',
                    split: true,
                    collapsible: true,
                    region: 'west'
                },
                {
                    xtype: 'sysadmin.resource.SelectorGrid',
                    ref: 'userResourcesGrid',
                    autoLoadStore: false,
                    disabled: true,
                    initialStore: userResourcesStore,
                    store: userResourcesStore,
                    region: 'center',
                    messages: {
                        createSuccess: this.T('msg_update_success'),
                        destroySuccess: this.T('msg_delete_success')
                    },
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            text: this.T('remove_all_user_resources')
                        },
                        '->',
                        {
                            xtype: 'bsbtnReset'
                        },
                        {
                            xtype: 'bsbtnSave'
                        }
                    ]
                }
            ]
        });

    	this.callParent(arguments);
    }
});
